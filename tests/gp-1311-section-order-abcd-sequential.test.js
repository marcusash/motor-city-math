// gp-1311-section-order-abcd-sequential.test.js
// Questions must appear in AAABBBBBBBBCCDD order — no section jumps.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
const EXPECTED = ['A','A','A','B','B','B','B','B','B','B','B','C','C','D','D'];
let pass = 0, fail = 0; const failures = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  const actual = data.questions.map(q => q.section);
  const ok = EXPECTED.every((s, i) => actual[i] === s);
  if (ok) pass++;
  else { fail++; failures.push(file + ': order=' + actual.join('')); }
}
console.log('gp-1311-section-order-abcd: ' + pass + ' pass, ' + fail + ' fail');
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- all ' + pass + ' exams have AAABBBBBBBBCCDD section order');
