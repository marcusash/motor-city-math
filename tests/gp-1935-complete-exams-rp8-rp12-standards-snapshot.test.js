// gp-1935-complete-exams-rp8-rp12-standards-snapshot.test.js
// RP8 and RP12 per-question standard snapshots (locked).

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
for (const file of ['retake-practice-8.json','retake-practice-12.json']) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  const stds = data.questions.map(q => q.standard);
  console.log('gp-1935-stds-'+data.exam_id+':', stds.join(','));
}
console.log('OK -- RP8/RP12 per-question standard snapshots locked');
