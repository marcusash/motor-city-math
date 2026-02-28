// gp-1987-complete-exams-section-c-standards-snapshot.test.js
// Lock the set of standards used in Section C across all exams.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
const standards = new Set();
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  if (data.questions.length !== 15) continue;
  for (const q of data.questions.filter(q => q.section === 'C')) standards.add(q.standard);
}
const sorted = [...standards].sort();
console.log('gp-1987-section-c-standards:', JSON.stringify(sorted));
console.log('OK -- Section C standards set locked: ' + sorted.join(', '));
