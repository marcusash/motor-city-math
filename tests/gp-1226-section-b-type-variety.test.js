// gp-1226-section-b-type-variety.test.js
// Section B must have >= 3 distinct question types per exam (coverage variety).

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let pass = 0, fail = 0; const failures = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  const secB = data.questions.filter(q => q.section === 'B');
  const types = new Set(secB.map(q => q.type));
  if (types.size >= 3) pass++;
  else { fail++; failures.push(file + ': only ' + types.size + ' distinct types in Section B'); }
}
console.log('gp-1226-section-b-type-variety: ' + pass + ' pass, ' + fail + ' fail');
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- all ' + pass + ' exams have >= 3 types in Section B');
