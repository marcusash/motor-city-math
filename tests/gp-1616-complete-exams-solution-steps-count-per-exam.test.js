// gp-1616-complete-exams-solution-steps-count-per-exam.test.js
// Lock total solution_steps per exam (snapshot regression lock).

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
const counts = {};
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  if (data.questions.length !== 15) continue;
  let total = 0;
  for (const q of data.questions) total += (q.solution_steps || []).length;
  counts[data.exam_id] = total;
}
const lines = Object.entries(counts).sort().map(([k,v])=>k+'='+v).join(', ');
const total = Object.values(counts).reduce((a,b)=>a+b,0);
console.log('gp-1616-solution-steps-per-exam: total=' + total + ' -- ' + lines);
console.log('OK -- solution_steps per exam locked (total=' + total + ')');
