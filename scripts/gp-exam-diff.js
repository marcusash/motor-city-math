#!/usr/bin/env node
// GP: gp-exam-diff.js
// Compare two RP exam files to show what changed.
// Usage: node scripts/gp-exam-diff.js <exam1.json> <exam2.json>
//   or:  node scripts/gp-exam-diff.js retake-practice-5 _backups/retake-practice-5-2026-02-23

const fs = require('fs');
const path = require('path');

const [, , arg1, arg2] = process.argv;
if (!arg1 || !arg2) {
  console.log('Usage: node scripts/gp-exam-diff.js <file1> <file2>');
  console.log('Example: node scripts/gp-exam-diff.js data/retake-practice-5.json data/_backups/retake-practice-5-2026-02-23.json');
  process.exit(0);
}

function resolveFile(arg) {
  if (fs.existsSync(arg)) return arg;
  const withJson = arg.endsWith('.json') ? arg : arg + '.json';
  if (fs.existsSync(withJson)) return withJson;
  const inData = path.join('data', withJson);
  if (fs.existsSync(inData)) return inData;
  throw new Error(`File not found: ${arg}`);
}

const file1 = resolveFile(arg1);
const file2 = resolveFile(arg2);
const j1 = JSON.parse(fs.readFileSync(file1, 'utf8'));
const j2 = JSON.parse(fs.readFileSync(file2, 'utf8'));

console.log(`\n=== EXAM DIFF ===`);
console.log(`A: ${file1} (${j1.exam_id})`);
console.log(`B: ${file2} (${j2.exam_id})\n`);

// Top-level field diff
const topFields = ['version', 'title'];
for (const f of topFields) {
  if (j1[f] !== j2[f]) console.log(`CHANGED ${f}: '${j2[f]}' -> '${j1[f]}'`);
}

// Per-question diff
const qs1 = Object.fromEntries((j1.questions || []).map(q => [q.id, q]));
const qs2 = Object.fromEntries((j2.questions || []).map(q => [q.id, q]));

let changes = 0;
for (const id of Object.keys(qs1)) {
  const q1 = qs1[id], q2 = qs2[id];
  if (!q2) { console.log(`ADDED ${id}`); changes++; continue; }
  
  const fields = ['hint', 'feedback_correct', 'feedback_wrong', 'question_html'];
  for (const f of fields) {
    if (q1[f] !== q2[f]) {
      console.log(`CHANGED ${id}.${f}:`);
      console.log(`  WAS: ${q2[f]}`);
      console.log(`  NOW: ${q1[f]}`);
      changes++;
    }
  }
  
  // Check graph key_points
  if (q1.graph && q2.graph) {
    const kp1 = JSON.stringify(q1.graph.key_points);
    const kp2 = JSON.stringify(q2.graph.key_points);
    if (kp1 !== kp2) {
      console.log(`CHANGED ${id}.graph.key_points:`);
      console.log(`  WAS: ${kp2}`);
      console.log(`  NOW: ${kp1}`);
      changes++;
    }
  }
  
  // Check answer
  for (let i = 0; i < (q1.inputs || []).length; i++) {
    const inp1 = q1.inputs[i], inp2 = (q2.inputs || [])[i];
    if (inp2 && inp1.answer !== inp2.answer) {
      console.log(`CHANGED ${id}.inputs[${i}].answer: ${inp2.answer} -> ${inp1.answer}`);
      changes++;
    }
  }
}

for (const id of Object.keys(qs2)) {
  if (!qs1[id]) { console.log(`REMOVED ${id}`); changes++; }
}

if (changes === 0) {
  console.log('No differences found.');
} else {
  console.log(`\n${changes} change(s) found.`);
}
