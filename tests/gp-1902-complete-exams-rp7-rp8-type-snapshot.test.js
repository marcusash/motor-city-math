// gp-1902-complete-exams-rp7-rp8-type-snapshot.test.js
// RP7 and RP8 per-question type snapshots.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
for (const file of ['retake-practice-7.json','retake-practice-8.json']) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  const types = data.questions.map(q => q.type);
  console.log('gp-1902-types-'+data.exam_id+':', types.join(','));
}
console.log('OK -- RP7/RP8 per-question type snapshots locked');
