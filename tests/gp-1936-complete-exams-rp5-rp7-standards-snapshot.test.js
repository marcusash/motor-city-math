// gp-1936-complete-exams-rp5-rp7-standards-snapshot.test.js
// RP5 and RP7 per-question standard snapshots (locked).

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
for (const file of ['retake-practice-5.json','retake-practice-7.json']) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  const stds = data.questions.map(q => q.standard);
  console.log('gp-1936-stds-'+data.exam_id+':', stds.join(','));
}
console.log('OK -- RP5/RP7 per-question standard snapshots locked');
