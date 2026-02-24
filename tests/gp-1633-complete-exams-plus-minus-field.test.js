// gp-1633-complete-exams-plus-minus-field.test.js
// Some questions have plus_minus field. Lock that it's boolean when present.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let pass = 0, fail = 0; const failures = [];
let withField = 0;
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  if (data.questions.length !== 15) continue;
  for (const q of data.questions) {
    if (!('plus_minus' in q)) continue;
    withField++;
    if (typeof q.plus_minus === 'boolean') pass++;
    else { fail++; failures.push(data.exam_id + ':' + q.id + ' plus_minus=' + JSON.stringify(q.plus_minus)); }
  }
}
console.log('gp-1633-plus-minus-field: ' + withField + ' questions have plus_minus, ' + pass + ' pass, ' + fail + ' fail');
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- plus_minus is boolean when present (' + withField + ' occurrences)');
