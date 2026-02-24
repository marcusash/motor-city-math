// gp-1388-input-id-starts-with-q.test.js
// All input ids must start with 'q'.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let pass = 0, fail = 0; const failures = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions) {
    for (const inp of (q.inputs || [])) {
      if (inp.id && inp.id.startsWith('q')) pass++;
      else { fail++; failures.push(file + ': ' + q.id + ' input id="' + inp.id + '" does not start with q'); }
    }
  }
}
console.log('gp-1388-input-id-starts-with-q: ' + pass + ' pass, ' + fail + ' fail');
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- all ' + pass + ' input ids start with q');
