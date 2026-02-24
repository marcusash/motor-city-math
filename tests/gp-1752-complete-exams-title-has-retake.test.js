// gp-1752-complete-exams-title-has-retake.test.js
// Title must contain 'Unit 2'. RP12 is a Final Paper Exam (known exception).

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
const KNOWN = new Set(['retake-practice-12']); // Final Paper Exam, not Retake
let pass = 0, fail = 0, advisory = 0; const failures = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  if (data.questions.length !== 15) continue;
  const examId = file.replace('.json', '');
  if (typeof data.title === 'string' && data.title.toLowerCase().includes('unit 2')) {
    pass++;
  } else if (KNOWN.has(examId)) {
    advisory++;
  } else {
    fail++;
    failures.push(file + ' title=' + data.title);
  }
}
console.log('gp-1752-title-has-unit2: ' + pass + ' pass, ' + advisory + ' advisory, ' + fail + ' fail');
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- all titles contain Unit 2 (' + pass + ' exams, ' + advisory + ' advisory)');
