#!/usr/bin/env node
// scripts/validate-exam-schema.cjs
// Validates all practice exam JSONs against data/schemas/practice-exam.schema.json
// Uses ajv (draft-07). Run: node scripts/validate-exam-schema.cjs
// Flags: --verbose  (print per-question detail for every exam)

'use strict';

const Ajv = require('ajv');
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const SCHEMA_PATH = path.join(ROOT, 'data', 'schemas', 'practice-exam.schema.json');
const DATA_DIR = path.join(ROOT, 'data');
const VERBOSE = process.argv.includes('--verbose');

const EXAM_FILES = [
  'retake-practice-1.json',
  'retake-practice-2.json',
  'retake-practice-3.json',
  'retake-practice-4.json',
  'retake-practice-5.json',
  'retake-practice-6.json',
  'retake-practice-7.json',
  'retake-practice-8.json',
  'retake-practice-9.json',
  'retake-practice-10.json',
  'retake-practice-11.json',
];

const ajv = new Ajv({ allErrors: true, allowUnionTypes: true });
const schema = JSON.parse(fs.readFileSync(SCHEMA_PATH, 'utf8'));
const validate = ajv.compile(schema);

let totalErrors = 0;
let totalWarnings = 0;
const results = [];

for (const filename of EXAM_FILES) {
  const filepath = path.join(DATA_DIR, filename);
  let data;
  try {
    data = JSON.parse(fs.readFileSync(filepath, 'utf8'));
  } catch (e) {
    console.error(`PARSE ERROR: ${filename}: ${e.message}`);
    totalErrors++;
    results.push({ file: filename, errors: 1, warnings: 0, status: 'PARSE_ERROR' });
    continue;
  }

  const valid = validate(data);

  // Additional warnings not expressible in JSON Schema:
  const warnings = [];

  // W-1: graph questions must have a graph field
  for (const q of (data.questions || [])) {
    if ((q.type === 'graph' || q.type === 'graph-rational') && !q.graph) {
      warnings.push(`Q${q.number} (${q.id}): type=${q.type} but no graph field`);
    }
    // W-2: dropdown inputs must have options
    for (const inp of (q.inputs || [])) {
      if (inp.type === 'dropdown' && (!inp.options || inp.options.length < 2)) {
        warnings.push(`Q${q.number} input ${inp.id}: dropdown with no options`);
      }
      // W-3: number inputs should have tolerance
      if (inp.type === 'number' && inp.answer !== undefined && inp.tolerance === undefined) {
        warnings.push(`Q${q.number} input ${inp.id}: number input missing tolerance`);
      }
    }
    // W-4: feedback_correct should be max 12 words (ADHD guideline)
    if (q.feedback_correct) {
      const words = q.feedback_correct.trim().split(/\s+/).length;
      if (words > 12) {
        warnings.push(`Q${q.number}: feedback_correct is ${words} words (ADHD max: 12)`);
      }
    }
  }

  const errorCount = valid ? 0 : validate.errors.length;
  const status = errorCount === 0 && warnings.length === 0 ? 'PASS'
    : errorCount === 0 ? 'WARN'
    : 'FAIL';

  if (!valid) {
    console.error(`\nFAIL ${filename} — ${errorCount} schema error(s):`);
    for (const err of validate.errors) {
      console.error(`  ${err.instancePath || '(root)'}: ${err.message}`);
      if (err.params && err.params.additionalProperty) {
        console.error(`    Unknown field: "${err.params.additionalProperty}"`);
      }
    }
  }

  if (warnings.length > 0) {
    const prefix = errorCount > 0 ? '' : `\nWARN ${filename}:`;
    if (errorCount === 0) console.warn(prefix);
    for (const w of warnings) {
      console.warn(`  [W] ${w}`);
    }
  }

  if (VERBOSE) {
    console.log(`\nVERBOSE ${filename}:`);
    for (const q of (data.questions || [])) {
      const inputTypes = (q.inputs || []).map(i => `${i.id}:${i.type}`).join(', ');
      const fields = [
        `Q${q.number}`,
        `std=${q.standard}`,
        `sec=${q.section}`,
        `type=${q.type}`,
        `inputs=[${inputTypes}]`,
        q.graph ? 'graph=YES' : '',
        q.hint ? 'hint=YES' : 'hint=NO',
        q.solution_steps ? `steps=${q.solution_steps.length}` : 'steps=NO',
      ].filter(Boolean).join('  ');
      console.log(`  ${fields}`);
    }
  }

  if (errorCount === 0 && warnings.length === 0) {
    console.log(`OK   ${filename}`);
  }

  totalErrors += errorCount;
  totalWarnings += warnings.length;
  results.push({ file: filename, errors: errorCount, warnings: warnings.length, status });
}

console.log('\n' + '='.repeat(60));
console.log(`Schema validation: ${EXAM_FILES.length} exams | Errors: ${totalErrors} | Warnings: ${totalWarnings}`);

if (totalErrors > 0) {
  console.log('FAIL — schema violations found. Fix before submitting exams.');
  process.exit(1);
} else {
  console.log('PASS — all exams conform to practice-exam.schema.json v1.0.0');
}
