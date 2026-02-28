// gp-1474-rp1-7-q1-is-identify.test.js
// Q1 (index 0) must be 'identify' in RP1-7 (older schema).

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = ['retake-practice-1.json','retake-practice-2.json','retake-practice-3.json',
  'retake-practice-4.json','retake-practice-5.json','retake-practice-6.json','retake-practice-7.json'];
let pass = 0, fail = 0; const failures = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  const q = data.questions[0];
  if (q && q.type === 'identify') pass++;
  else { fail++; failures.push(data.exam_id + ': Q1 type=' + (q && q.type)); }
}
console.log('gp-1474-rp1-7-q1-is-identify: ' + pass + '/7 pass');
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- Q1 is identify in RP1-7 (identify schema)');
