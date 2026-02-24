// gp-1192-exam-ids-sequential.test.js
// Exam IDs must be retake-practice-1 through retake-practice-11 with no gaps.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
const ids = RP_FILES.map(f => parseInt(f.match(/\d+/)[0])).sort((a,b)=>a-b);
let pass = 0, fail = 0; const failures = [];
for (let i = 0; i < ids.length; i++) {
  const expected = i + 1;
  if (ids[i] === expected) pass++;
  else { fail++; failures.push('Expected retake-practice-' + expected + ' but got ' + ids[i]); }
}
console.log('gp-1192-exam-ids-sequential: ' + pass + ' pass, ' + fail + ' fail');
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- exam IDs are sequential 1-' + ids.length + ' with no gaps');
