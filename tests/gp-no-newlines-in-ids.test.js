// gp-no-newlines-in-ids.test.js — question and input IDs must not contain newlines or carriage returns

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

let pass = 0;
let fail = 0;
const issues = [];

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions) {
    const qId = String(q.id || '');
    if (/[\r\n]/.test(qId)) {
      fail++;
      issues.push(`${file}: question id has newline: '${JSON.stringify(qId)}'`);
    } else {
      pass++;
    }
    for (const inp of (q.inputs || [])) {
      const iId = String(inp.id || '');
      if (/[\r\n]/.test(iId)) {
        fail++;
        issues.push(`${file}: input id has newline: '${JSON.stringify(iId)}'`);
      } else {
        pass++;
      }
    }
  }
}

console.log(`gp-no-newlines-in-ids: ${pass} pass, ${fail} fail`);
if (issues.length) {
  issues.forEach(i => console.log('  ', i));
  process.exit(1);
}
console.log(`OK — all ${pass} IDs are newline-free`);
