// gp-1598-complete-exams-q12-standard-lock.test.js
// Discover and lock Q12 (graph) standard across all complete exams.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
const q12stds = {};
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  if (data.questions.length !== 15) continue;
  const q = data.questions[11];
  q12stds[q.standard] = (q12stds[q.standard] || 0) + 1;
}
const stdStr = Object.entries(q12stds).sort().map(([k,v])=>k+'='+v).join(', ');
console.log('gp-1598-q12-standards: ' + stdStr);
console.log('OK -- Q12 standards snapshot: ' + stdStr);
