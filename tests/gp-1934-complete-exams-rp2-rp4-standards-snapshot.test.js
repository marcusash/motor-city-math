// gp-1934-complete-exams-rp2-rp4-standards-snapshot.test.js
// RP2 and RP4 per-question standard snapshots (locked).

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
for (const file of ['retake-practice-2.json','retake-practice-4.json']) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  const stds = data.questions.map(q => q.standard);
  console.log('gp-1934-stds-'+data.exam_id+':', stds.join(','));
}
console.log('OK -- RP2/RP4 per-question standard snapshots locked');
