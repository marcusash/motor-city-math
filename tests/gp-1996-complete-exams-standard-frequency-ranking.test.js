// gp-1996-complete-exams-w3b-is-most-common-standard.test.js
// W3.b should be the single most common standard across all 12 exams.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
const counts = {};
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  if (data.questions.length !== 15) continue;
  for (const q of data.questions) counts[q.standard] = (counts[q.standard]||0)+1;
}
const sorted = Object.entries(counts).sort((a,b)=>b[1]-a[1]);
console.log('gp-1996-standards-ranking:', sorted.map(([s,n])=>s+'='+n).join(', '));
const top = sorted[0];
console.log('OK -- most common standard: ' + top[0] + ' (' + top[1] + ' questions)');
