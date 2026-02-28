// gp-1845-complete-exams-section-d-standards-snapshot.test.js
// Section D standards across all 12 exams.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
const stdCounts = {};
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  if (data.questions.length !== 15) continue;
  for (const q of data.questions.filter(q => q.section === 'D')) {
    stdCounts[q.standard] = (stdCounts[q.standard]||0)+1;
  }
}
const sorted = Object.entries(stdCounts).sort((a,b) => b[1]-a[1]);
console.log('gp-1845-section-d-standards:', JSON.stringify(Object.fromEntries(sorted)));
console.log('OK -- Section D standards snapshot: ' + sorted.length + ' distinct standards');
