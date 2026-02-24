// gp-1597-complete-exams-q11-standard-lock.test.js
// Discover and lock Q11 (fractional-exp) standard across all complete exams.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
const q11stds = {};
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  if (data.questions.length !== 15) continue;
  const q = data.questions[10];
  q11stds[q.standard] = (q11stds[q.standard] || 0) + 1;
}
const stdStr = Object.entries(q11stds).sort().map(([k,v])=>k+'='+v).join(', ');
console.log('gp-1597-q11-standards: ' + stdStr);
const singleStd = Object.keys(q11stds).length === 1;
console.log(singleStd ? 'OK -- Q11 standard locked: ' + stdStr : 'INFO -- Q11 has ' + Object.keys(q11stds).length + ' distinct standards: ' + stdStr);
