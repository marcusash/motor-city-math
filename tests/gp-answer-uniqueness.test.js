#!/usr/bin/env node
// gp-answer-uniqueness.test.js — Single-input questions must have unique answers per exam
// Multi-part questions (multiple inputs) are exempt - sub-answers naturally overlap
const fs = require('fs'), path = require('path');
const DATA = path.join(__dirname, '..', 'data');
let pass = 0, fail = 0;
const files = fs.readdirSync(DATA).filter(f => f.match(/^retake-practice-\d+\.json$/));
for (const file of files) {
  const json = JSON.parse(fs.readFileSync(path.join(DATA, file)));
  const seen = {};
  const singleInputQs = (json.questions || []).filter(q => (q.inputs || []).length === 1);
  for (const q of singleInputQs) {
    const a = q.inputs[0].answer;
    if (a === undefined) continue;
    const key = String(a);
    if (seen[key]) {
      console.log(`FAIL: ${file} duplicate answer=${a} on ${q.id} and ${seen[key]}`); fail++;
    } else { seen[key] = q.id; pass++; }
  }
}
console.log(`\ngp-answer-uniqueness (single-input): ${pass} pass, ${fail} fail`);
process.exit(fail > 0 ? 1 : 0);