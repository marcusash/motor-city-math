// gp-1606-complete-exams-dropdown-answer-in-options.test.js
// Dropdown answer must be one of the listed options.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let pass = 0, fail = 0; const failures = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  if (data.questions.length !== 15) continue;
  for (const q of data.questions) {
    for (const inp of (q.inputs || [])) {
      if (inp.type !== 'dropdown') continue;
      const opts = (inp.options || []).map(o => typeof o === 'object' ? o.value : o);
      if (inp.answer && opts.includes(String(inp.answer))) pass++;
      else { fail++; failures.push(data.exam_id + ':' + q.id + ':' + inp.id + ' answer=' + inp.answer + ' not in options'); }
    }
  }
}
console.log('gp-1606-dropdown-answer-in-options: ' + pass + ' pass, ' + fail + ' fail');
if (failures.length) { failures.slice(0,5).forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- all dropdown answers are in options list (' + pass + ' checked)');
