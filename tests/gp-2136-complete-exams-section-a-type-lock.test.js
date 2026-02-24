// gp-2136-complete-exams-section-a-type-lock.test.js
// OLDER (RP1-7, RP12): Section A = [identify,identify,identify]
// NEWER (RP8-11):      Section A = [quadratic,absolute-value,absolute-value]

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let pass = 0, fail = 0; const failures = [];
const OLDER_EXP = ['identify','identify','identify'];
const NEWER_EXP = ['quadratic','absolute-value','absolute-value'];
const OLDER = new Set(['retake-practice-1','retake-practice-2','retake-practice-3','retake-practice-4',
                       'retake-practice-5','retake-practice-6','retake-practice-7','retake-practice-12']);
const NEWER = new Set(['retake-practice-8','retake-practice-9','retake-practice-10','retake-practice-11']);
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  if (data.questions.length !== 15) continue;
  const aTypes = data.questions.filter(q => q.section === 'A').sort((a,b)=>a.number-b.number).map(q=>q.type);
  const id = data.exam_id.replace('.json','');
  let exp = OLDER.has(id) ? OLDER_EXP : (NEWER.has(id) ? NEWER_EXP : null);
  if (exp && JSON.stringify(aTypes) === JSON.stringify(exp)) pass++;
  else { fail++; failures.push(id + ' A=' + JSON.stringify(aTypes) + ' expected=' + JSON.stringify(exp)); }
}
console.log('gp-2136-section-a-type-lock: ' + pass + ' pass, ' + fail + ' fail');
if (fail > 0) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- Section A type lock: older=[identify x3] newer=[quadratic,abs,abs]');
