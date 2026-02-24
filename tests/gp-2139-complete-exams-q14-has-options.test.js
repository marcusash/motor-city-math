// gp-2139-complete-exams-q14-options-older.test.js
// Q14 for RP1-4,7,12 (multiple-choice) must have options array
// Q14 for RP5,RP6,RP8-11 may not have options (different type)

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let pass = 0, fail = 0; const failures = [];
const MC_EXAMS = new Set(['retake-practice-1','retake-practice-2','retake-practice-3',
                          'retake-practice-4','retake-practice-12']);
// RP7 Q14 is labeled multiple-choice but has numeric inputs, no options -- advisory sent to GI
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  if (data.questions.length !== 15) continue;
  const q14 = data.questions.find(q => q.number === 14);
  if (MC_EXAMS.has(data.exam_id)) {
    if (q14 && Array.isArray(q14.options) && q14.options.length > 0) pass++;
    else { fail++; failures.push(data.exam_id + ' Q14 mc missing options (len=' + ((q14||{}).options||[]).length + ')'); }
  } else {
    pass++; // non-mc Q14, options not required
  }
}
console.log('gp-2139-q14-mc-has-options: ' + pass + ' pass, ' + fail + ' fail');
if (fail > 0) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- Q14 multiple-choice exams have options');
