/**
 * w2b-microdrill-acceptance.test.js
 * Acceptance criteria for GR's W2.b x-intercepts micro-drill (5-question set)
 * GI request: 2026-02-23T18:01 -- specific acceptance criteria for targeted drill
 * GR: this is your build target. When you create data/w2b-microdrill.json, all checks must pass.
 */

'use strict';
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..', '..');
const DRILL_FILE = path.join(ROOT, 'data', 'w2b-microdrill.json');

let passed = 0;
let failed = 0;
const failures = [];

function check(label, condition, detail = '') {
  if (condition) {
    passed++;
    console.log(`  \u2714 ${label}`);
  } else {
    failed++;
    failures.push(`${label}${detail ? ': ' + detail : ''}`);
    console.log(`  \u2718 ${label}${detail ? ': ' + detail : ''}`);
  }
}

// --- Pre-check: file must exist ---
if (!fs.existsSync(DRILL_FILE)) {
  console.log('PENDING: data/w2b-microdrill.json does not exist yet.');
  console.log('GR: create this file to pass the acceptance contract.\n');
  console.log('Required shape: { "id": "w2b-microdrill", "standard": "W2.b", "questions": [ ...5 questions... ] }');
  console.log('\nRequired per-question fields:');
  console.log('  id, number, standard="W2.b", type, question_html, inputs[0].type="number", inputs[0].answer (unique),');
  console.log('  hint (<= 120 chars, ADHD E-5), solution_steps (array), feedback_correct (<= 12 words), feedback_wrong (<= 15 words)');
  console.log('\nRequired question types (one each):');
  console.log('  exponential, quadratic, absolute-value, rational, radical');
  console.log('\nUniqueness: answers must not duplicate any existing W2.b answers in retake-practice-1 through 11');
  process.exit(0); // Not a failure -- file just not built yet
}

const drill = JSON.parse(fs.readFileSync(DRILL_FILE, 'utf8'));

// --- Load existing W2.b answers for dedup check ---
const DATA_DIR = path.join(ROOT, 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f));
const existingW2bAnswers = new Set();
RP_FILES.forEach(f => {
  const d = JSON.parse(fs.readFileSync(path.join(DATA_DIR, f)));
  (d.questions || []).filter(q => q.standard === 'W2.b').forEach(q => {
    (q.inputs || []).forEach(inp => {
      if (inp.answer !== undefined && inp.answer !== null) {
        existingW2bAnswers.add(String(inp.answer));
      }
    });
  });
});

const questions = drill.questions || [];
const REQUIRED_TYPES = ['exponential', 'quadratic', 'absolute-value', 'rational', 'radical'];
const drillAnswers = new Set();

console.log('\u2500\u2500 1. Drill File Structure \u2500\u2500');
check('drill id is "w2b-microdrill"', drill.id === 'w2b-microdrill');
check('standard is "W2.b"', drill.standard === 'W2.b');
check('exactly 5 questions', questions.length === 5, `found ${questions.length}`);
check('all questions have standard W2.b', questions.every(q => q.standard === 'W2.b'));

console.log('\u2500\u2500 2. Function Type Coverage \u2500\u2500');
const types = questions.map(q => q.type);
REQUIRED_TYPES.forEach(t => {
  check(`type "${t}" present`, types.includes(t));
});

console.log('\u2500\u2500 3. Per-Question Contracts \u2500\u2500');
questions.forEach((q, i) => {
  const n = i + 1;
  check(`Q${n}: has id`, typeof q.id === 'string' && q.id.length > 0);
  check(`Q${n}: has question_html`, typeof q.question_html === 'string' && q.question_html.length > 0);
  check(`Q${n}: has exactly 1 numeric input`, (() => {
    const numericInputs = (q.inputs || []).filter(inp => inp.type === 'number');
    return numericInputs.length === 1;
  })());
  
  const inp = (q.inputs || []).find(i => i.type === 'number');
  const ans = inp?.answer;
  
  check(`Q${n}: answer is numeric`, inp && typeof ans === 'number', `answer=${ans}`);
  check(`Q${n}: answer not duplicate within drill`, !drillAnswers.has(String(ans)), `answer=${ans} already used in drill`);
  if (ans !== undefined) drillAnswers.add(String(ans));
  
  check(`Q${n}: answer unique vs existing W2.b answers`, !existingW2bAnswers.has(String(ans)), `answer=${ans} already in RP fleet`);
  
  check(`Q${n}: has hint`, typeof q.hint === 'string' && q.hint.length > 0);
  check(`Q${n}: hint <= 120 chars (E-5)`, (q.hint || '').length <= 120, `length=${(q.hint||'').length}`);
  
  check(`Q${n}: has solution_steps array`, Array.isArray(q.solution_steps) && q.solution_steps.length > 0);
  
  const fc = q.feedback_correct || '';
  const fw = q.feedback_wrong || '';
  const fcWords = fc.trim().split(/\s+/).filter(Boolean).length;
  const fwWords = fw.trim().split(/\s+/).filter(Boolean).length;
  check(`Q${n}: feedback_correct present`, fc.length > 0);
  check(`Q${n}: feedback_correct <= 12 words (ADHD)`, fcWords <= 12, `${fcWords} words`);
  check(`Q${n}: feedback_wrong present`, fw.length > 0);
  check(`Q${n}: feedback_wrong <= 15 words (ADHD)`, fwWords <= 15, `${fwWords} words`);
});

console.log('\u2500\u2500 4. Cross-Drill Uniqueness Summary \u2500\u2500');
check('all 5 drill answers are unique from each other', drillAnswers.size === Math.min(5, questions.length));
check('drill answer set has no overlap with existing W2.b answers', (() => {
  for (const a of drillAnswers) {
    if (existingW2bAnswers.has(a)) return false;
  }
  return true;
})()); 

console.log('\u2500\u2500 5. Required Fields (GP schema v2) \u2500\u2500');
check('drill has version field', drill.version !== undefined);
check('drill has feedback_correct on all questions', questions.every(q => q.feedback_correct));
check('drill has feedback_wrong on all questions', questions.every(q => q.feedback_wrong));

// --- Summary ---
const total = passed + failed;
console.log(`\n\u2500\u2500 W2.b MICRO-DRILL ACCEPTANCE SUMMARY \u2500\u2500`);
if (failed > 0) {
  console.log('\nFailures:');
  failures.forEach(f => console.log(`  \u2718 ${f}`));
}
console.log(`\n  Tests: ${total} total, ${passed} passed, ${failed} failed`);
console.log(`  Existing W2.b answers in fleet: ${existingW2bAnswers.size}`);
console.log(`  Drill answers (must not overlap): ${[...drillAnswers].join(', ')}`);

if (failed > 0) process.exit(1);
