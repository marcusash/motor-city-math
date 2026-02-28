// gp-1189-total-key-points-regression.test.js
// Total key_points across all exams must stay at 110 (22 graphs x 5).

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let total = 0;
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions.filter(q => q.graph)) {
    total += (q.graph.key_points || []).length;
  }
}
const EXPECTED = 110;
console.log('gp-1189-total-key-points: ' + total + ' (expected ' + EXPECTED + ')');
if (total !== EXPECTED) { console.log('  FAIL: mismatch'); process.exit(1); }
console.log('OK -- total key_points locked at ' + EXPECTED + ' (22 graphs x 5)');
