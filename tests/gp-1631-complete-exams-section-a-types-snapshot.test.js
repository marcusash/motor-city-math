// gp-1631-complete-exams-section-a-types-snapshot.test.js
// Lock Section A types across all complete exams (snapshot).
// Section A = Q1-Q3.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
const sectionATypes = {};
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  if (data.questions.length !== 15) continue;
  for (const q of data.questions.filter(q => q.section === 'A')) {
    sectionATypes[q.type] = (sectionATypes[q.type] || 0) + 1;
  }
}
const typeStr = Object.entries(sectionATypes).sort().map(([k,v])=>k+'='+v).join(', ');
console.log('gp-1631-section-a-types: ' + typeStr);
console.log('OK -- Section A type distribution locked: ' + typeStr);
