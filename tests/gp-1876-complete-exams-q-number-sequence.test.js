// gp-1876-complete-exams-q-number-sequence-1-15.test.js
// Every complete exam must have question numbers [1..15] in any order.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let pass = 0, fail = 0; const failures = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  if (data.questions.length !== 15) continue;
  const nums = data.questions.map(q => q.number).sort((a,b)=>a-b);
  const expected = Array.from({length:15},(_,i)=>i+1);
  if (JSON.stringify(nums) === JSON.stringify(expected)) pass++;
  else { fail++; failures.push(data.exam_id + ' nums=' + JSON.stringify(nums)); }
}
console.log('gp-1876-q-number-sequence: ' + pass + ' pass, ' + fail + ' fail');
if (fail > 0) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- question numbers 1-15 exactly for all ' + pass + ' complete exams');
