// gp-1139-q14-section-d.test.js
const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let pass = 0, fail = 0; const failures = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  const q14 = data.questions[13];
  if (q14 && q14.section === 'D') pass++;
  else { fail++; failures.push(file + ': Q14 section=' + q14?.section); }
}
console.log('gp-1139-q14-section-d: ' + pass + ' pass, ' + fail + ' fail');
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- all ' + pass + ' Q14 questions are in Section D');
