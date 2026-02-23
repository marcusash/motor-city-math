#!/usr/bin/env node
// gp-feedback-length.test.js — feedback_correct and feedback_wrong under 12 words (ADHD rule)
const fs = require('fs'), path = require('path');
const DATA = path.join(__dirname, '..', 'data');
let pass = 0, fail = 0;
const files = fs.readdirSync(DATA).filter(f => f.match(/^retake-practice-\d+\.json$/));
for (const file of files) {
  const json = JSON.parse(fs.readFileSync(path.join(DATA, file)));
  for (const q of (json.questions || [])) {
    for (const field of ['feedback_correct','feedback_wrong']) {
      if (!q[field]) continue;
      const words = q[field].trim().split(/\s+/).length;
      if (words > 12) { console.log(`WARN: ${file} ${q.id}.${field} = ${words} words (max 12)`); fail++; }
      else pass++;
    }
  }
}
console.log(`\ngp-feedback-length: ${pass} pass, ${fail} warn`);
process.exit(fail > 0 ? 1 : 0);