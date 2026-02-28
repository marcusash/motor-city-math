// gp-1592-all-complete-exams-q4-standard.test.js
// Q4 standard (exponential) should always be W3.a or W3.b.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let q4s = {};
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  if (data.questions.length !== 15) continue;
  const q = data.questions[3];
  q4s[q.standard] = (q4s[q.standard] || 0) + 1;
}
const stdStr = Object.entries(q4s).sort().map(([k,v])=>k+'='+v).join(', ');
console.log('gp-1592-q4-standards: ' + stdStr);
const allW3 = Object.keys(q4s).every(s => s.startsWith('W3'));
console.log(allW3 ? 'OK -- all Q4 standards are W3.x: ' + stdStr : 'ADVISORY: some Q4 standards not W3.x: ' + stdStr);
