// gp-2179-complete-exams-standards-within-allowed-set.test.js
// All standards must be from the allowed set: W2.a-e, W3.a-f

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
const ALLOWED = new Set(['W2.a','W2.b','W2.c','W2.d','W2.e','W3.a','W3.b','W3.c','W3.d','W3.e','W3.f']);
let pass = 0, fail = 0; const failures = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  if (data.questions.length !== 15) continue;
  const bad = data.questions.filter(q => !ALLOWED.has(q.standard));
  if (bad.length === 0) pass++;
  else { fail++; failures.push(data.exam_id + ' bad standards: ' + bad.map(q=>q.number+':'+q.standard).join(',')); }
}
console.log('gp-2179-standards-allowed-set: ' + pass + ' pass, ' + fail + ' fail');
if (fail > 0) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- All standards are within allowed set W2.a-e, W3.a-f');
