// gp-inputs-no-duplicate-ids-global.test.js
// Input IDs must be globally unique within each exam (not just per question)

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
  const seen = new Set();
  let examOk = true;
  
  for (const q of data.questions) {
    for (const inp of (q.inputs || [])) {
      if (seen.has(inp.id)) {
        examOk = false;
        issues.push(`${file}: duplicate input id '${inp.id}' in Q${q.id}`);
      }
      seen.add(inp.id);
    }
  }
  
  if (examOk) {
    pass++;
  } else {
    fail++;
  }
}

console.log(`gp-inputs-no-duplicate-ids-global: ${pass} pass, ${fail} fail`);
if (issues.length) {
  issues.forEach(i => console.log('  ', i));
  process.exit(1);
}
console.log(`OK — all ${pass} exams have globally unique input IDs`);
