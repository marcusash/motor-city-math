// gp-2004-complete-exams-total-type-diversity-snapshot.test.js
// Count how many distinct question types exist across all 12 complete exams.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
const types = new Set();
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  if (data.questions.length !== 15) continue;
  for (const q of data.questions) types.add(q.type);
}
const sorted = [...types].sort();
console.log('gp-2004-distinct-types:', sorted.length, JSON.stringify(sorted));
console.log('OK -- ' + sorted.length + ' distinct question types across corpus');
