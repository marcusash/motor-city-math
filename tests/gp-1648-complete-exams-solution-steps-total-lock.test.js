// gp-1648-complete-exams-solution-steps-total-lock.test.js
// Total solution_steps across all 12 complete exams = 822 (locked).

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let total = 0;
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  if (data.questions.length !== 15) continue;
  for (const q of data.questions) total += (q.solution_steps || []).length;
}
console.log('gp-1648-total-solution-steps: ' + total);
if (total !== 822) { console.log('FAIL: expected 822, got ' + total); process.exit(1); }
console.log('OK -- total solution_steps = 822');
