// gp-1595-complete-exams-exam-id-unique.test.js
// Each exam must have a unique exam_id across all complete exam files.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
const ids = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  if (data.questions.length !== 15) continue;
  ids.push(data.exam_id);
}
const unique = new Set(ids).size;
console.log('gp-1595-exam-ids-unique: ' + ids.length + ' exams, ' + unique + ' unique IDs');
if (unique !== ids.length) {
  console.log('FAIL: duplicate exam_ids detected');
  process.exit(1);
}
console.log('OK -- all ' + unique + ' complete exam_ids are unique');
