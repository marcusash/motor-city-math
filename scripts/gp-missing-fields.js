#!/usr/bin/env node
// gp-missing-fields.js — List every question missing any required field
const fs = require('fs'), path = require('path');
const DATA = path.join(__dirname, '..', 'data');
const FIELDS = ['question_html','inputs','hint','solution_steps','feedback_correct','feedback_wrong'];
const files = fs.readdirSync(DATA).filter(f => f.match(/^retake-practice-\d+\.json$/));
let issues = 0;
for (const file of files) {
  const json = JSON.parse(fs.readFileSync(path.join(DATA, file)));
  for (const q of (json.questions || [])) {
    const missing = FIELDS.filter(f => !q[f] || (Array.isArray(q[f]) && q[f].length === 0));
    if (missing.length) { console.log(`${file} ${q.id}: missing ${missing.join(', ')}`); issues++; }
  }
}
console.log(issues === 0 ? '\n✅ No missing fields' : `\n${issues} questions with missing fields`);