// gp-all-standards-known.test.js — all standard tags must be from the W2.a-e / W3.a-e set

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

const KNOWN_STANDARDS = new Set([
  'W2.a', 'W2.b', 'W2.c', 'W2.d', 'W2.e',
  'W3.a', 'W3.b', 'W3.c', 'W3.d', 'W3.e'
]);

let pass = 0;
let fail = 0;
const issues = [];

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions) {
    const std = q.standard || '';
    if (KNOWN_STANDARDS.has(std)) {
      pass++;
    } else {
      fail++;
      issues.push(`${file}: Q${q.id} has unknown standard '${std}'`);
    }
  }
}

console.log(`gp-all-standards-known: ${pass} pass, ${fail} fail`);
if (issues.length) {
  issues.forEach(i => console.log('  ', i));
  process.exit(1);
}
console.log(`OK — all ${pass} questions have known W2/W3 standards`);
