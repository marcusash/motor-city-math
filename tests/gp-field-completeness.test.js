#!/usr/bin/env node
// gp-field-completeness.test.js — All RP exam JSON files have required fields
const fs = require('fs'), path = require('path');
const DATA = path.join(__dirname, '..', 'data');
const REQUIRED = ['question_html','inputs','hint','solution_steps','feedback_correct','feedback_wrong'];
let pass = 0, fail = 0;
const files = fs.readdirSync(DATA).filter(f => f.match(/^retake-practice-\d+\.json$/));
for (const file of files) {
  const json = JSON.parse(fs.readFileSync(path.join(DATA, file)));
  for (const q of (json.questions || [])) {
    for (const field of REQUIRED) {
      if (q[field] === undefined || q[field] === null || q[field] === '') {
        console.log(`FAIL: ${file} ${q.id} missing ${field}`); fail++;
      } else pass++;
    }
  }
}
console.log(`\ngp-field-completeness: ${pass} pass, ${fail} fail`);
process.exit(fail > 0 ? 1 : 0);