// gp-1479-rp7-11-have-text-inputs.test.js
// RP7-11 all have at least 10 text inputs each (open-response heavy exams).

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = ['retake-practice-7.json','retake-practice-8.json','retake-practice-9.json',
  'retake-practice-10.json','retake-practice-11.json'];
let pass = 0, fail = 0; const failures = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  const count = data.questions.reduce((s, q) => s + (q.inputs || []).filter(i => i.type === 'text').length, 0);
  if (count >= 10) pass++;
  else { fail++; failures.push(data.exam_id + ': text=' + count + ' (expected >=10)'); }
}
console.log('gp-1479-rp7-11-text-inputs: ' + pass + '/5 pass');
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- RP7-11 all have 10+ text inputs');
