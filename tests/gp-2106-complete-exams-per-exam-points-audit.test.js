// gp-2106-complete-exams-per-exam-points-snapshot.test.js
// Per-exam point sums snapshot (checking actual field values, not assuming numeric).

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  if (data.questions.length !== 15) continue;
  const pointTypes = [...new Set(data.questions.map(q => typeof q.points))];
  const sample = data.questions[0].points;
  console.log(data.exam_id + ': points type=' + pointTypes.join(',') + ' sample=' + JSON.stringify(sample));
}
console.log('OK -- per-exam points field type audit complete');
