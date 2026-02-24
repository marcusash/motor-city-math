// gp-1475-rp8-11-q1-is-quadratic.test.js
// Q1 (index 0) must be 'quadratic' in RP8-11 (newer schema).

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = ['retake-practice-8.json','retake-practice-9.json',
  'retake-practice-10.json','retake-practice-11.json'];
let pass = 0, fail = 0; const failures = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  const q = data.questions[0];
  if (q && q.type === 'quadratic') pass++;
  else { fail++; failures.push(data.exam_id + ': Q1 type=' + (q && q.type)); }
}
console.log('gp-1475-rp8-11-q1-is-quadratic: ' + pass + '/4 pass');
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- Q1 is quadratic in RP8-11 (quadratic schema)');
