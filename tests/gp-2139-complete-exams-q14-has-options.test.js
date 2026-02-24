// gp-2139-complete-exams-q14-options-in-older.test.js
// OLDER (RP1-7, RP12): Q14=radio, must have options
// NEWER (RP8-11): Q14=write-equation, no options expected

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let pass = 0, fail = 0; const failures = [];
const OLDER = new Set(['retake-practice-1','retake-practice-2','retake-practice-3','retake-practice-4',
                       'retake-practice-5','retake-practice-6','retake-practice-7','retake-practice-12']);
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  if (data.questions.length !== 15) continue;
  const q14 = data.questions.find(q => q.number === 14);
  const id = data.exam_id.replace('.json','');
  if (OLDER.has(id)) {
    if (q14 && Array.isArray(q14.options) && q14.options.length > 0) pass++;
    else { fail++; failures.push(id + ' Q14 radio missing options'); }
  } else {
    pass++; // newer: write-equation, no options needed
  }
}
console.log('gp-2139-q14-options-older: ' + pass + ' pass, ' + fail + ' fail');
if (fail > 0) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- Q14 options present in all older exams');
