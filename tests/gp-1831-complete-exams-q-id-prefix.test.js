// gp-1831-complete-exams-q-id-format-rp-prefix.test.js
// Every question ID must start with 'rp{N}-' matching the exam number.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let pass = 0, fail = 0; const failures = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  if (data.questions.length !== 15) continue;
  const n = file.match(/retake-practice-(\d+)\.json/)[1];
  for (const q of data.questions) {
    if (q.id.startsWith('rp' + n + '-')) pass++;
    else { fail++; failures.push(file + ':' + q.id + ' prefix mismatch (expected rp' + n + '-)'); }
  }
}
console.log('gp-1831-q-id-prefix: ' + pass + ' pass, ' + fail + ' fail');
if (fail > 0) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- all question IDs have correct rp{N}- prefix (' + pass + ' questions)');
