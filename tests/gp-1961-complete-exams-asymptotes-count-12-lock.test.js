// gp-1961-complete-exams-asymptotes-count-12-lock.test.js
// Exactly 12 of 24 graphs have asymptotes field (rational/absolute-value functions).

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let withAsym = 0, withoutAsym = 0;
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  if (data.questions.length !== 15) continue;
  for (const q of data.questions) {
    if (!q.graph) continue;
    if (q.graph.asymptotes !== undefined) withAsym++; else withoutAsym++;
  }
}
console.log('gp-1961-asymptotes: withAsym='+withAsym+' withoutAsym='+withoutAsym);
if (withAsym !== 12 || withoutAsym !== 12) { console.log('FAIL: expected 12/12'); process.exit(1); }
console.log('OK -- asymptotes count locked: 12 graphs with, 12 without');
