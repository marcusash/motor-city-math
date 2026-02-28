// gp-1872-complete-exams-q-number-no-duplicates-per-exam.test.js
// Within each exam, question numbers must be unique (no two questions with same number).

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let pass = 0, fail = 0; const failures = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  if (data.questions.length !== 15) continue;
  const nums = data.questions.map(q => q.number);
  const unique = new Set(nums);
  if (unique.size === nums.length) pass++;
  else { fail++; failures.push(data.exam_id + ' has duplicate question numbers'); }
}
console.log('gp-1872-q-numbers-unique-per-exam: ' + pass + ' pass, ' + fail + ' fail');
if (fail > 0) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- question numbers unique within each exam (' + pass + ' exams)');
