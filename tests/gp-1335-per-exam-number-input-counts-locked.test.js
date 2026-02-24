// gp-1335-per-exam-number-input-counts-locked.test.js
// Per-exam number input counts: RP1-3=20, RP4-5=22, RP6=25, RP7=28, RP8=27, RP9=28, RP10=29, RP11=31.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const EXPECTED = { 1:20, 2:20, 3:20, 4:22, 5:22, 6:25, 7:28, 8:27, 9:28, 10:29, 11:31 };
let pass = 0, fail = 0; const failures = [];
for (let n = 1; n <= 11; n++) {
  const file = 'retake-practice-' + n + '.json';
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  let count = 0;
  for (const q of data.questions) count += (q.inputs || []).filter(i => i.type === 'number').length;
  if (count === EXPECTED[n]) pass++;
  else { fail++; failures.push('RP' + n + ': ' + count + ' (expected ' + EXPECTED[n] + ')'); }
}
console.log('gp-1335-per-exam-number-input-counts: ' + pass + ' pass, ' + fail + ' fail');
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- per-exam number input counts locked (RP1-3:20, RP4-5:22, RP6:25, RP7:28, RP8:27, RP9:28, RP10:29, RP11:31)');
