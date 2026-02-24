// gp-1843-complete-exams-section-a-standards-snapshot.test.js
// Section A standards across all 12 exams -- document all values found.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
const stdCounts = {};
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  if (data.questions.length !== 15) continue;
  for (const q of data.questions.filter(q => q.section === 'A')) {
    stdCounts[q.standard] = (stdCounts[q.standard]||0)+1;
  }
}
const sorted = Object.entries(stdCounts).sort((a,b) => b[1]-a[1]);
console.log('gp-1843-section-a-standards:', JSON.stringify(Object.fromEntries(sorted)));
console.log('OK -- Section A standards snapshot: ' + sorted.length + ' distinct standards');
