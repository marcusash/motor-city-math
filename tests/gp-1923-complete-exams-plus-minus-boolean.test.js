// gp-1923-complete-exams-plus-minus-is-boolean.test.js
// All plus_minus fields on inputs must be boolean (not string or number).

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let checked = 0, pass = 0, fail = 0; const failures = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  if (data.questions.length !== 15) continue;
  for (const q of data.questions) for (const inp of (q.inputs||[])) {
    if (!Object.prototype.hasOwnProperty.call(inp, 'plus_minus')) continue;
    checked++;
    if (typeof inp.plus_minus === 'boolean') pass++;
    else { fail++; failures.push(data.exam_id+':'+q.id+':'+inp.id+' plus_minus='+typeof inp.plus_minus+'('+inp.plus_minus+')'); }
  }
}
console.log('gp-1923-plus-minus-boolean: checked='+checked+' pass='+pass+' fail='+fail);
if (fail > 0) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- all '+pass+' plus_minus fields are boolean ('+checked+' checked)');
