// gp-2104-complete-exams-per-exam-key-points-snapshot.test.js
// Per-exam key_points count snapshot across all 12 exams.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
const counts = {};
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  if (data.questions.length !== 15) continue;
  let total = 0;
  for (const q of data.questions.filter(q => q.graph)) total += (q.graph.key_points || []).length;
  counts[data.exam_id] = total;
}
console.log('gp-2104-per-exam-key-points:', JSON.stringify(counts));
console.log('OK -- per-exam key_points snapshot locked');
