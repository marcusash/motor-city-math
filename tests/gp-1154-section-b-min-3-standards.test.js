// gp-1154-section-b-min-3-standards.test.js
// Section B (8 questions) should cover at least 3 distinct standards per exam.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let pass = 0, fail = 0; const failures = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  const stds = new Set(data.questions.filter(q => q.section === 'B').map(q => q.standard));
  if (stds.size >= 3) pass++;
  else { fail++; failures.push(file + ': Section B only ' + stds.size + ' distinct standards'); }
}
console.log('gp-1154-section-b-min-3-standards: ' + pass + ' pass, ' + fail + ' fail');
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- all ' + pass + ' exams have >= 3 standards in Section B');
