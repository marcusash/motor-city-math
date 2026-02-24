// gp-2006-complete-exams-q14-always-word-or-write.test.js
// Q14 (Section D first) must be word-problem, write-equation, or error-analysis.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
const VALID = new Set(['word-problem','write-equation','error-analysis','multiple-choice','construct']);
let pass = 0, fail = 0; const failures = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  if (data.questions.length !== 15) continue;
  const q14 = data.questions.find(q => q.number === 14);
  if (q14 && VALID.has(q14.type)) pass++;
  else { fail++; failures.push(data.exam_id + ' Q14 type=' + (q14&&q14.type)); }
}
console.log('gp-2006-q14-type: ' + pass + ' pass, ' + fail + ' fail');
if (fail > 0) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- Q14 is Section D type in all ' + pass + ' exams');
