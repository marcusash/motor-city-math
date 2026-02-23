// gp-1106-per-exam-numeric-answer-range.test.js
// Audit numeric answer range per exam: min, max, and count.

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

console.log(`gp-1106-per-exam-numeric-answer-range: numeric answer audit`);
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  const nums = [];
  for (const q of data.questions) {
    for (const inp of (q.inputs || [])) {
      if (inp.type !== 'number') continue;
      const v = parseFloat(String(inp.answer).replace(/,/g, ''));
      if (!isNaN(v)) nums.push(v);
    }
  }
  const name = file.replace('retake-practice-', 'RP').replace('.json', '');
  if (nums.length) {
    const min = Math.min(...nums), max = Math.max(...nums);
    console.log(`  ${name}: ${nums.length} numbers, min=${min}, max=${max}`);
  }
}
console.log(`OK -- per-exam numeric answer range audit complete`);
