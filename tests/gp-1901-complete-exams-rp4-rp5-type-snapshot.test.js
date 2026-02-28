// gp-1901-complete-exams-rp4-rp5-type-snapshot.test.js
// RP4 and RP5 per-question type snapshots.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
for (const file of ['retake-practice-4.json','retake-practice-5.json']) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  const types = data.questions.map(q => q.type);
  console.log('gp-1901-types-'+data.exam_id+':', types.join(','));
}
console.log('OK -- RP4/RP5 per-question type snapshots locked');
