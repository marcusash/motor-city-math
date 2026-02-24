// gp-1325-total-distinct-standards-is-10.test.js
// Exactly 10 distinct standards are used across all 11 exams.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
const standards = new Set();
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  data.questions.forEach(q => standards.add(q.standard));
}
const EXPECTED = 10;
console.log('gp-1325-distinct-standards: ' + standards.size + ' (expected ' + EXPECTED + ')');
console.log('  Standards:', Array.from(standards).sort().join(', '));
if (standards.size !== EXPECTED) { console.log('  FAIL: expected', EXPECTED, 'got', standards.size); process.exit(1); }
console.log('OK -- exactly ' + EXPECTED + ' distinct standards locked');
