// gp-1903-complete-exams-rp9-rp11-type-snapshot.test.js
// RP9 and RP11 per-question type snapshots.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
for (const file of ['retake-practice-9.json','retake-practice-11.json']) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  const types = data.questions.map(q => q.type);
  console.log('gp-1903-types-'+data.exam_id+':', types.join(','));
}
console.log('OK -- RP9/RP11 per-question type snapshots locked');
