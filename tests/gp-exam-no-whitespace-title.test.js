// gp-exam-no-whitespace-title.test.js — exam title/subtitle should not have leading/trailing whitespace

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
  const label = file.replace('retake-practice-', 'RP').replace('.json', '');
  
  for (const field of ['title', 'subtitle']) {
    const val = data[field];
    if (!val) continue;
    if (val !== val.trim()) {
      fail++;
      issues.push(`${label}: ${field} has leading/trailing whitespace: "${val.substring(0, 40)}"`);
    } else {
      pass++;
    }
  }
}

console.log(`gp-exam-no-whitespace-title: ${pass} pass, ${fail} fail`);
if (issues.length) {
  issues.forEach(i => console.log('  ', i));
  process.exit(1);
}
console.log(`OK — all ${pass} title/subtitle fields are trim`);
