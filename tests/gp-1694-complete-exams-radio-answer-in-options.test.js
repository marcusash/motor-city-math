// gp-1694-complete-exams-radio-answer-in-options.test.js
// Radio answer must be one of the options values.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let pass = 0, fail = 0; const failures = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  if (data.questions.length !== 15) continue;
  for (const q of data.questions) {
    for (const inp of (q.inputs || [])) {
      if (inp.type !== 'radio') continue;
      const opts = (inp.options || []).map(o => String(o.value !== undefined ? o.value : o));
      const labels = (inp.options || []).map(o => String(o.label !== undefined ? o.label : o));
      const ans = String(inp.answer);
      if (opts.includes(ans) || labels.includes(ans)) pass++;
      else { fail++; failures.push(data.exam_id+':'+q.id+':'+inp.id+' answer='+ans); }
    }
  }
}
console.log('gp-1694-radio-answer-in-options: ' + pass + ' pass, ' + fail + ' fail');
if (failures.length) { failures.slice(0,5).forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- all radio answers exist in options (' + pass + ' checked)');
