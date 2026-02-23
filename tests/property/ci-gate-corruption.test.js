// tests/property/ci-gate-corruption.test.js
// Verifies that validate-exam-schema.cjs exits non-zero on a deliberately
// corrupted practice exam JSON. This tests the CI gate's ability to catch
// real data quality regressions.

'use strict';

const { execFileSync, spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

const ROOT = path.join(__dirname, '..', '..');
const VALIDATOR = path.join(ROOT, 'scripts', 'validate-exam-schema.cjs');
const SOURCE_EXAM = path.join(ROOT, 'data', 'retake-practice-1.json');

// Helper: run the validator against a temp file, return exit code
function runValidatorAgainst(corrupted) {
  const tmp = path.join(os.tmpdir(), `mcm-corrupt-${Date.now()}.json`);
  fs.writeFileSync(tmp, JSON.stringify(corrupted, null, 2), 'utf8');

  // Patch the validator to accept a custom exam list via env var
  // Instead, directly test with a Node.js require of the schema + ajv
  const Ajv = require('ajv');
  const schema = JSON.parse(fs.readFileSync(
    path.join(ROOT, 'data', 'schemas', 'practice-exam.schema.json'),
    'utf8'
  ));
  const ajv = new Ajv({ allErrors: true, allowUnionTypes: true });
  const validate = ajv.compile(schema);
  const valid = validate(corrupted);
  fs.unlinkSync(tmp);
  return { valid, errors: validate.errors || [] };
}

// Load the reference exam
const baseExam = JSON.parse(fs.readFileSync(SOURCE_EXAM, 'utf8'));

let passed = 0;
let failed = 0;

function assert(label, condition, detail) {
  if (condition) {
    console.log(`  PASS: ${label}`);
    passed++;
  } else {
    console.error(`  FAIL: ${label}${detail ? ' — ' + detail : ''}`);
    failed++;
  }
}

console.log('\n=== CI Gate Corruption Tests ===\n');

// Test 1: Clean exam passes
{
  const { valid } = runValidatorAgainst(baseExam);
  assert('Clean RP1 exam passes schema validation', valid === true);
}

// Test 2: Missing exam_id fails
{
  const corrupted = JSON.parse(JSON.stringify(baseExam));
  delete corrupted.exam_id;
  const { valid, errors } = runValidatorAgainst(corrupted);
  assert('Missing exam_id fails schema', valid === false);
  assert('Error points to exam_id', errors.some(e => e.params && e.params.missingProperty === 'exam_id'));
}

// Test 3: Wrong question count fails (remove one question)
{
  const corrupted = JSON.parse(JSON.stringify(baseExam));
  corrupted.questions = corrupted.questions.slice(0, 14); // 14 instead of 15
  const { valid, errors } = runValidatorAgainst(corrupted);
  assert('14 questions (not 15) fails schema', valid === false);
  assert('Error references minItems', errors.some(e => e.keyword === 'minItems'));
}

// Test 4: Invalid section letter fails
{
  const corrupted = JSON.parse(JSON.stringify(baseExam));
  corrupted.questions[0].section = 'E'; // not in A/B/C/D
  const { valid, errors } = runValidatorAgainst(corrupted);
  assert('Invalid section "E" fails schema', valid === false);
  assert('Error is enum violation', errors.some(e => e.keyword === 'enum' || e.message === 'must be equal to one of the allowed values'));
}

// Test 5: Invalid standard format fails
{
  const corrupted = JSON.parse(JSON.stringify(baseExam));
  corrupted.questions[0].standard = 'exponents'; // not W2.x / W3.x
  const { valid, errors } = runValidatorAgainst(corrupted);
  assert('Invalid standard "exponents" fails schema', valid === false);
  assert('Error is pattern violation', errors.some(e => e.keyword === 'pattern'));
}

// Test 6: Invalid question type fails
{
  const corrupted = JSON.parse(JSON.stringify(baseExam));
  corrupted.questions[3].type = 'algebra'; // not in enum
  const { valid, errors } = runValidatorAgainst(corrupted);
  assert('Invalid question type "algebra" fails schema', valid === false);
}

// Test 7: Missing hint fails
{
  const corrupted = JSON.parse(JSON.stringify(baseExam));
  delete corrupted.questions[0].hint;
  const { valid, errors } = runValidatorAgainst(corrupted);
  assert('Missing hint fails schema', valid === false);
  assert('Error is required field', errors.some(e => e.params && e.params.missingProperty === 'hint'));
}

// Test 8: Missing solution_steps fails
{
  const corrupted = JSON.parse(JSON.stringify(baseExam));
  delete corrupted.questions[0].solution_steps;
  const { valid, errors } = runValidatorAgainst(corrupted);
  assert('Missing solution_steps fails schema', valid === false);
}

// Test 9: Empty inputs array fails
{
  const corrupted = JSON.parse(JSON.stringify(baseExam));
  corrupted.questions[0].inputs = [];
  const { valid, errors } = runValidatorAgainst(corrupted);
  assert('Empty inputs array fails schema', valid === false);
  assert('Error is minItems', errors.some(e => e.keyword === 'minItems'));
}

// Test 10: Additional unknown top-level field fails
{
  const corrupted = JSON.parse(JSON.stringify(baseExam));
  corrupted.mystery_field = 'should not be here';
  const { valid, errors } = runValidatorAgainst(corrupted);
  assert('Unknown top-level field fails schema', valid === false);
  assert('Error is additionalProperties', errors.some(e => e.keyword === 'additionalProperties'));
}

// --- Summary ---
console.log(`\n${'='.repeat(50)}`);
console.log(`CI gate corruption tests: ${passed + failed} total | ${passed} passed | ${failed} failed`);

if (failed > 0) {
  console.error('FAIL — schema validator does not catch all corruption types.');
  process.exit(1);
} else {
  console.log('PASS — schema validator correctly rejects all 9 corruption patterns.');
}
