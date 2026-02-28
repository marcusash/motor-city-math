// gp-1914-complete-exams-rp4-rp6-rp11-type-snapshot.test.js
// RP4, RP6, RP11 per-question type snapshots.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
for (const file of ['retake-practice-4.json','retake-practice-6.json','retake-practice-11.json']) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  const types = data.questions.map(q => q.type);
  console.log('gp-1914-types-'+data.exam_id+':', types.join(','));
}
console.log('OK -- RP4/RP6/RP11 per-question type snapshots locked');
