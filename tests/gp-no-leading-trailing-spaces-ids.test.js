// gp-no-leading-trailing-spaces-ids.test.js — question IDs and input IDs must not have whitespace

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
    const qId = q.id || '';
    if (qId !== qId.trim()) {
      fail++;
      issues.push(`${file}: question id '${qId}' has leading/trailing whitespace`);
    } else {
      pass++;
    }
    
    for (const inp of (q.inputs || [])) {
      const iId = inp.id || '';
      if (iId !== iId.trim()) {
        fail++;
        issues.push(`${file}: input id '${iId}' in Q${q.id} has whitespace`);
      } else {
        pass++;
      }
    }
  }
}

console.log(`gp-no-leading-trailing-spaces-ids: ${pass} pass, ${fail} fail`);
if (issues.length) {
  issues.forEach(i => console.log('  ', i));
  process.exit(1);
}
console.log(`OK — all ${pass} IDs are whitespace-free`);
