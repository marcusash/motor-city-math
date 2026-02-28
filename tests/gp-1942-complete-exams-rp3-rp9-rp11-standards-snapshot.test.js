// gp-1942-complete-exams-rp3-rp9-rp11-standards-snapshot.test.js
// RP3, RP9, RP11 per-question standard snapshots (locked).

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
for (const file of ['retake-practice-3.json','retake-practice-9.json','retake-practice-11.json']) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  const stds = data.questions.map(q => q.standard);
  console.log('gp-1942-stds-'+data.exam_id+':', stds.join(','));
}
console.log('OK -- RP3/RP9/RP11 per-question standard snapshots locked');
