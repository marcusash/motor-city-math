// gp-2008-complete-exams-q12-always-graph-type.test.js
// Q12 (Section C first) must have type 'graph' or 'rational' (RP11 outlier).

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
const VALID = new Set(['graph','rational']);
let pass = 0, fail = 0; const failures = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  if (data.questions.length !== 15) continue;
  const q12 = data.questions.find(q => q.number === 12);
  if (q12 && VALID.has(q12.type)) pass++;
  else { fail++; failures.push(data.exam_id + ' Q12 type=' + (q12&&q12.type)); }
}
console.log('gp-2008-q12-type: ' + pass + ' pass, ' + fail + ' fail');
if (fail > 0) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- Q12 is graph or rational in all ' + pass + ' exams');
