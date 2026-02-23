/**
 * gp-exam-standards-map.js
 * Reports which standards are covered by each exam and aggregates coverage.
 * Helps GI and GR identify gaps before authoring RP11.
 *
 * Usage: node scripts/gp-exam-standards-map.js
 */
const fs = require('fs');
const path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');

const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => f.startsWith('retake-practice-') && f.endsWith('.json'))
  .sort();

const STANDARDS = ['W2.a', 'W2.b', 'W2.c', 'W2.d', 'W2.e', 'W3.a', 'W3.b', 'W3.c', 'W3.d'];

// standardMap[standard][examId] = count
const standardMap = {};
STANDARDS.forEach(s => { standardMap[s] = {}; });

// totals[standard] = total count across all exams
const totals = {};
STANDARDS.forEach(s => { totals[s] = 0; });

for (const fname of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, fname), 'utf8'));
  if (!data.questions || data.questions.length === 0) continue;

  const examId = data.exam_id || fname.replace('.json', '');
  for (const q of data.questions) {
    const std = q.standard || '(none)';
    if (!standardMap[std]) standardMap[std] = {};
    standardMap[std][examId] = (standardMap[std][examId] || 0) + 1;
    totals[std] = (totals[std] || 0) + 1;
  }
}

console.log('\n=== GP Standards Coverage Map ===\n');
console.log('Standard | Total Qs | Exams covering it');
console.log('---------|----------|------------------');

for (const std of STANDARDS) {
  const exams = Object.keys(standardMap[std] || {});
  const total = totals[std] || 0;
  console.log(`${std.padEnd(8)} | ${String(total).padEnd(8)} | ${exams.join(', ') || '(none)'}`);
}

console.log('\n=== Per-Exam Standard Breakdown ===');
for (const fname of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, fname), 'utf8'));
  if (!data.questions || data.questions.length === 0) {
    console.log(`\n${fname}: stub (0 questions)`);
    continue;
  }
  const examId = data.exam_id || fname.replace('.json', '');
  const breakdown = {};
  for (const q of data.questions) {
    const std = q.standard || '(none)';
    breakdown[std] = (breakdown[std] || 0) + 1;
  }
  const parts = Object.entries(breakdown).map(([s, c]) => `${s}:${c}`).join(', ');
  console.log(`\n${examId} (${data.questions.length}q): ${parts}`);
}
