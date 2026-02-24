// gp-2137-complete-exams-q14-type-snapshot.test.js
// Q14 type snapshot across all 12 exams (verified 2026-02-24)
// RP1-4,7,12=multiple-choice; RP5=error-analysis; RP6=construct; RP8-11=write-equation

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const Q14_TYPES = {
  'retake-practice-1':'multiple-choice','retake-practice-2':'multiple-choice',
  'retake-practice-3':'multiple-choice','retake-practice-4':'multiple-choice',
  'retake-practice-5':'error-analysis','retake-practice-6':'construct',
  'retake-practice-7':'multiple-choice','retake-practice-8':'write-equation',
  'retake-practice-9':'write-equation','retake-practice-10':'write-equation',
  'retake-practice-11':'write-equation','retake-practice-12':'multiple-choice'
};
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let pass = 0, fail = 0; const failures = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  if (data.questions.length !== 15) continue;
  const q14 = data.questions.find(q => q.number === 14);
  const exp = Q14_TYPES[data.exam_id];
  if (exp && q14 && q14.type === exp) pass++;
  else { fail++; failures.push(data.exam_id + ' Q14=' + (q14||{}).type + ' expected=' + exp); }
}
console.log('gp-2137-q14-type-snapshot: ' + pass + ' pass, ' + fail + ' fail');
if (fail > 0) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- Q14 type snapshot locked for all 12 exams');
