// gp-2027-complete-exams-radio-answer-in-options.test.js
// All radio answers must be one of the listed options.
// Options may be plain strings OR objects with {value, text} (schema variant).

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
      const opts = inp.options || [];
      // Handle both string options and {value, text} object options
      const validValues = opts.map(o => typeof o === 'object' ? o.value : o);
      if (validValues.includes(inp.answer)) pass++;
      else { fail++; failures.push(data.exam_id+':'+q.id+'.'+inp.id+' answer="'+inp.answer+'" not in '+JSON.stringify(validValues)); }
    }
  }
}
console.log('gp-2027-radio-answer-in-options: ' + pass + ' pass, ' + fail + ' fail');
if (fail > 0) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- all 7 radio answers are valid option values');
