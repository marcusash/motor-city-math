// gp-1216-total-graphs-regression.test.js
// Total graphs across all exams must stay at 22 (2 per exam).

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let total = 0;
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  total += data.questions.filter(q => q.graph).length;
}
const EXPECTED = 22;
console.log('gp-1216-total-graphs: ' + total + ' (expected ' + EXPECTED + ')');
if (total !== EXPECTED) { console.log('  FAIL'); process.exit(1); }
console.log('OK -- total graphs locked at ' + EXPECTED);
