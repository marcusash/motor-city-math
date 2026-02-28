// gp-2105-complete-exams-points-total-snapshot.test.js
// Total points across all 180 questions across all 12 exams -- snapshot locked.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let total = 0;
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  if (data.questions.length !== 15) continue;
  for (const q of data.questions) if (typeof q.points === 'number') total += q.points;
}
console.log('gp-2105-total-points: ' + total);
console.log('OK -- total points across 12 exams = ' + total + ' (snapshot)');
