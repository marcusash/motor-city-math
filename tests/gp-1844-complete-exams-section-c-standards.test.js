// gp-1844-complete-exams-section-c-standards-snapshot.test.js
// Section C standards (graph questions) across all 12 exams.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
const stdCounts = {};
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  if (data.questions.length !== 15) continue;
  for (const q of data.questions.filter(q => q.section === 'C')) {
    stdCounts[q.standard] = (stdCounts[q.standard]||0)+1;
  }
}
const sorted = Object.entries(stdCounts).sort((a,b) => b[1]-a[1]);
console.log('gp-1844-section-c-standards:', JSON.stringify(Object.fromEntries(sorted)));
console.log('OK -- Section C standards snapshot: ' + sorted.length + ' distinct standards');
