// gp-2042-complete-exams-graphs-key-points-total.test.js
// Total key_points across all 24 graphs must equal 122.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let total = 0;
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  if (data.questions.length !== 15) continue;
  for (const q of data.questions.filter(q => q.graph)) {
    total += (q.graph.key_points || []).length;
  }
}
console.log('gp-2042-total-key-points: ' + total);
if (total !== 122) { console.log('FAIL: expected 122, got ' + total); process.exit(1); }
console.log('OK -- total graph key_points across 12 exams = 122');
