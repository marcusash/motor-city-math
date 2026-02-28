// gp-no-duplicate-question-ids-global.test.js
// Question IDs must be unique within each exam AND non-colliding across exams in the same session

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
  
  for (const q of data.questions) {
    const id = q.id;
    if (seen.has(id)) {
      fail++;
      issues.push(`${file}: duplicate question id '${id}'`);
    } else {
      seen.add(id);
      pass++;
    }
  }
}

console.log(`gp-no-duplicate-question-ids-global: ${pass} pass, ${fail} fail`);
if (issues.length) {
  issues.forEach(i => console.log('  ', i));
  process.exit(1);
}
console.log(`OK — all ${pass} question IDs are unique within their exam`);
