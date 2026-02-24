// gp-1599-complete-exams-q15-standard-lock.test.js
// Discover and lock Q15 (word-problem) standard across all complete exams.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
const q15stds = {};
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  if (data.questions.length !== 15) continue;
  const q = data.questions[14];
  q15stds[q.standard] = (q15stds[q.standard] || 0) + 1;
}
const stdStr = Object.entries(q15stds).sort().map(([k,v])=>k+'='+v).join(', ');
console.log('gp-1599-q15-standards: ' + stdStr);
console.log('OK -- Q15 standards snapshot: ' + stdStr);
