// gp-1985-complete-exams-section-a-standards-snapshot.test.js
// Lock the set of standards used in Section A across all exams.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
const standards = new Set();
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  if (data.questions.length !== 15) continue;
  for (const q of data.questions.filter(q => q.section === 'A')) standards.add(q.standard);
}
const sorted = [...standards].sort();
console.log('gp-1985-section-a-standards:', JSON.stringify(sorted));
console.log('OK -- Section A standards set locked: ' + sorted.join(', '));
