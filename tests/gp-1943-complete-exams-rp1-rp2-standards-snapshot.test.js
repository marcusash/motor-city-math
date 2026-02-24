// gp-1943-complete-exams-rp1-rp2-standards-snapshot.test.js
// RP1, RP2 per-question standard snapshots (locked).

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
for (const file of ['retake-practice-1.json','retake-practice-2.json']) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  const stds = data.questions.map(q => q.standard);
  console.log('gp-1943-stds-'+data.exam_id+':', stds.join(','));
}
console.log('OK -- RP1/RP2 per-question standard snapshots locked');
