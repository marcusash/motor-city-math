#!/usr/bin/env node
// gp-exam-readiness-score.js — score each exam's data quality for release readiness
// Outputs a ranked table of exam readiness (100 = fully release-ready)

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

const EMDASH_RE = /[—–]/;

function scoreExam(file, data) {
  const results = [];
  let total = 0;
  let earned = 0;
  
  function check(label, points, pass) {
    total += points;
    if (pass) { earned += points; results.push(`  OK  ${label}`); }
    else results.push(`  FAIL ${label} (-${points}pts)`);
  }
  
  const questions = data.questions;
  const inputs = questions.flatMap(q => q.inputs || []);
  const answeredInputs = inputs.filter(i => i.answer !== undefined && i.answer !== null);
  
  check('title present', 5, !!(data.title && data.title.trim().length > 3));
  check('subtitle present', 5, !!(data.subtitle && data.subtitle.trim().length > 5));
  check('schema_version valid', 5, ['1.0', '2.0'].includes(String(data.schema_version || '')));
  check('15 questions', 10, questions.length === 15);
  check('sequential numbering', 5, questions.every((q, i) => q.number === i + 1));
  check('all IDs formatted', 5, questions.every(q => /^rp\d+-q\d+$/.test(q.id)));
  
  // Content checks
  const noEmDash = questions.every(q =>
    !EMDASH_RE.test(q.feedback_correct || '') &&
    !EMDASH_RE.test(q.feedback_wrong || '') &&
    !EMDASH_RE.test(q.hint || '')
  );
  check('no em dashes', 10, noEmDash);
  
  const answerCoverage = inputs.length > 0
    ? (answeredInputs.length / inputs.length)
    : 1;
  check('100% answers filled', 15, answerCoverage === 1);
  check('>80% answers filled', 5, answerCoverage >= 0.8);
  
  check('all hints present', 5, questions.every(q => (q.hint || '').trim().length > 0));
  check('all feedback_correct present', 5, questions.every(q => (q.feedback_correct || '').trim().length > 0));
  check('all feedback_wrong present', 5, questions.every(q => (q.feedback_wrong || '').trim().length > 0));
  check('all solution_steps arrays', 5, questions.every(q => Array.isArray(q.solution_steps) && q.solution_steps.length > 0));
  check('all 4 sections present', 5, new Set(questions.map(q => q.section)).size >= 4);
  
  const pct = Math.round((earned / total) * 100);
  return { pct, earned, total, results };
}

console.log('\n=== GP Exam Readiness Scorecard ===\n');
console.log('Exam       Score  Status');
console.log('-'.repeat(50));

const scores = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  const { pct, earned, total, results } = scoreExam(file, data);
  const label = file.replace('retake-practice-', 'RP').replace('.json', '').padEnd(10);
  const status = pct >= 90 ? 'READY' : pct >= 75 ? 'NEAR-READY' : 'NEEDS WORK';
  console.log(`${label} ${String(pct).padStart(3)}%   ${status}`);
  scores.push({ file, pct, results });
}

console.log('\nMin score:', Math.min(...scores.map(s => s.pct)) + '%');
console.log('Avg score:', Math.round(scores.reduce((s, x) => s + x.pct, 0) / scores.length) + '%');

const belowReady = scores.filter(s => s.pct < 90);
if (belowReady.length > 0) {
  console.log('\n--- Issues to fix ---');
  for (const s of belowReady) {
    console.log(`\n${s.file}:`);
    s.results.filter(r => r.includes('FAIL')).forEach(r => console.log(r));
  }
}
