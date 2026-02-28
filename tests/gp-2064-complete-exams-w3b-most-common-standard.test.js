// gp-2064-complete-exams-w3b-most-common-standard.test.js
// W3.b must be the most common standard across all 12 complete exams (38 questions).

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
const counts = {};
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  if (data.questions.length !== 15) continue;
  for (const q of data.questions) counts[q.standard] = (counts[q.standard]||0)+1;
}
const top = Object.entries(counts).sort((a,b)=>b[1]-a[1])[0];
console.log('gp-2064-top-standard: ' + top[0] + '=' + top[1]);
if (top[0] !== 'W3.b' || top[1] !== 38) { console.log('FAIL: expected W3.b=38, got '+top[0]+'='+top[1]); process.exit(1); }
console.log('OK -- W3.b is most common standard with 38 questions');
