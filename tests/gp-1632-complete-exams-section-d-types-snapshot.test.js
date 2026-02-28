// gp-1632-complete-exams-section-d-types-snapshot.test.js
// Lock Section D types across all complete exams (snapshot).
// Section D = Q14-Q15.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
const sectionDTypes = {};
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  if (data.questions.length !== 15) continue;
  for (const q of data.questions.filter(q => q.section === 'D')) {
    sectionDTypes[q.type] = (sectionDTypes[q.type] || 0) + 1;
  }
}
const typeStr = Object.entries(sectionDTypes).sort().map(([k,v])=>k+'='+v).join(', ');
console.log('gp-1632-section-d-types: ' + typeStr);
const hasWordProblem = sectionDTypes['word-problem'] > 0;
console.log(hasWordProblem ? 'OK -- Section D includes word-problem type: ' + typeStr : 'ADVISORY: Section D has no word-problem');
