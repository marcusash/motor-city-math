// gp-2005-complete-exams-section-a-always-type-identify-or-quadratic.test.js
// Section A Q1 is always 'identify' (old schema) or 'quadratic' (new schema).

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
const VALID_Q1 = new Set(['identify','quadratic']);
let pass = 0, fail = 0; const failures = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  if (data.questions.length !== 15) continue;
  const q1 = data.questions.find(q => q.number === 1);
  if (q1 && VALID_Q1.has(q1.type)) pass++;
  else { fail++; failures.push(data.exam_id + ' Q1 type=' + (q1&&q1.type)); }
}
console.log('gp-2005-q1-type: ' + pass + ' pass, ' + fail + ' fail');
if (fail > 0) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- Q1 is identify or quadratic in all ' + pass + ' exams');
