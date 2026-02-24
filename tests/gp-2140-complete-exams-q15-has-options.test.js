// gp-2140-complete-exams-q15-options-in-older.test.js
// OLDER (RP1-7, RP12): Q15=dropdown, must have options
// NEWER (RP8-11): Q15=word-problem, no options expected

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let pass = 0, fail = 0; const failures = [];
const OLDER = new Set(['retake-practice-1','retake-practice-2','retake-practice-3','retake-practice-4',
                       'retake-practice-5','retake-practice-6','retake-practice-7','retake-practice-12']);
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  if (data.questions.length !== 15) continue;
  const q15 = data.questions.find(q => q.number === 15);
  const id = data.exam_id.replace('.json','');
  if (OLDER.has(id)) {
    if (q15 && Array.isArray(q15.options) && q15.options.length > 0) pass++;
    else { fail++; failures.push(id + ' Q15 dropdown missing options'); }
  } else {
    pass++; // newer: word-problem, no options needed
  }
}
console.log('gp-2140-q15-options-older: ' + pass + ' pass, ' + fail + ' fail');
if (fail > 0) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- Q15 options present in all older exams');
