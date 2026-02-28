// gp-question-standard-matches-w2-or-w3.test.js — standards must start with W2 or W3 (algebra 2 curriculum)

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

let pass = 0;
let fail = 0;
const failures = [];

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions) {
    const std = q.standard || '';
    if (!std.startsWith('W2.') && !std.startsWith('W3.')) {
      fail++;
      failures.push(`${file}: Q${q.id} standard='${std}' not W2.x or W3.x`);
    } else {
      pass++;
    }
  }
}

console.log(`gp-question-standard-matches-w2-or-w3: ${pass} pass, ${fail} fail`);
if (failures.length) {
  failures.slice(0, 5).forEach(f => console.log('  FAIL:', f));
  process.exit(1);
}
console.log(`OK — all ${pass} questions have W2.x or W3.x standards`);
