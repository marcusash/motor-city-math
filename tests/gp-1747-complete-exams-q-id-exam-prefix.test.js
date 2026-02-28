// gp-1747-complete-exams-q-id-matches-exam.test.js
// Question ID prefix must match exam number.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let pass = 0, fail = 0; const failures = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  if (data.questions.length !== 15) continue;
  const rpNum = file.match(/retake-practice-(\d+)\.json/)[1];
  for (const q of data.questions) {
    if (q.id.startsWith('rp' + rpNum + '-')) pass++;
    else { fail++; failures.push(data.exam_id + ':' + q.id + ' wrong prefix (expect rp' + rpNum + '-)'); }
  }
}
console.log('gp-1747-q-id-exam-prefix: ' + pass + ' pass, ' + fail + ' fail');
if (failures.length) { failures.slice(0,5).forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- all question ID prefixes match their exam number (' + pass + ' checked)');
