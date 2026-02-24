// gp-2141-complete-exams-q14-input-count-snapshot.test.js
// Q14 per-exam input count snapshot (verified 2026-02-24)
// RP1-5,7,12=1 input; RP6=3; RP7=3; RP8=3; RP9=2; RP10=3; RP11=5

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const Q14_INPUT_COUNTS = {
  'retake-practice-1':1,'retake-practice-2':1,'retake-practice-3':1,
  'retake-practice-4':1,'retake-practice-5':1,'retake-practice-6':3,
  'retake-practice-7':3,'retake-practice-8':3,'retake-practice-9':2,
  'retake-practice-10':3,'retake-practice-11':5,'retake-practice-12':1
};
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let pass = 0, fail = 0; const failures = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  if (data.questions.length !== 15) continue;
  const q14 = data.questions.find(q => q.number === 14);
  const n = (q14 && q14.inputs) ? q14.inputs.length : 0;
  const exp = Q14_INPUT_COUNTS[data.exam_id];
  if (exp !== undefined && n === exp) pass++;
  else { fail++; failures.push(data.exam_id + ' Q14.inputs.length=' + n + ' expected=' + exp); }
}
console.log('gp-2141-q14-input-count: ' + pass + ' pass, ' + fail + ' fail');
if (fail > 0) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- Q14 input count snapshot locked for all 12 exams');
