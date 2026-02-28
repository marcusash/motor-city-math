// gp-1138-q15-always-word-problem.test.js
const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let pass = 0, fail = 0; const failures = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  const q15 = data.questions[14];
  if (q15 && q15.type === 'word-problem') pass++;
  else { fail++; failures.push(file + ': Q15 type=' + q15?.type); }
}
console.log('gp-1138-q15-always-word-problem: ' + pass + ' pass, ' + fail + ' fail');
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- all ' + pass + ' Q15 questions are word-problem type');
