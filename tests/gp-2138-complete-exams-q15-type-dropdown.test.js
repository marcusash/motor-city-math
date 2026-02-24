// gp-2138-complete-exams-q15-type-lock.test.js
// OLDER (RP1-7, RP12): Q15=dropdown; NEWER (RP8-11): Q15=word-problem

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let pass = 0, fail = 0; const failures = [];
const OLDER = new Set(['retake-practice-1','retake-practice-2','retake-practice-3','retake-practice-4',
                       'retake-practice-5','retake-practice-6','retake-practice-7','retake-practice-12']);
const NEWER = new Set(['retake-practice-8','retake-practice-9','retake-practice-10','retake-practice-11']);
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  if (data.questions.length !== 15) continue;
  const q15 = data.questions.find(q => q.number === 15);
  const id = data.exam_id.replace('.json','');
  const expType = OLDER.has(id) ? 'dropdown' : (NEWER.has(id) ? 'word-problem' : null);
  if (expType && q15 && q15.type === expType) pass++;
  else { fail++; failures.push(id + ' Q15.type=' + (q15 ? q15.type : 'MISSING') + ' expected=' + expType); }
}
console.log('gp-2138-q15-type-lock: ' + pass + ' pass, ' + fail + ' fail');
if (fail > 0) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- Q15 type lock: dropdown (older) or word-problem (newer)');
