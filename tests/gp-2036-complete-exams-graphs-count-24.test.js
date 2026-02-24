// gp-2036-complete-exams-graphs-count-24.test.js
// Total graph entries across all 12 exams must equal 24 (2 per exam).

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let total = 0;
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  if (data.questions.length !== 15) continue;
  total += (data.graphs || []).length;
}
console.log('gp-2036-total-graphs: ' + total);
if (total !== 24) { console.log('FAIL: expected 24, got ' + total); process.exit(1); }
console.log('OK -- total graphs across 12 exams = 24');
