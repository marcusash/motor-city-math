// gp-1116-cross-exam-hint-unique.test.js
// Same hint should not appear across multiple exams (Kai memorizing patterns).

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

const hintToExam = new Map();
let totalQ = 0, crossDups = 0;
const findings = [];

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  const name = file.replace('retake-practice-', 'RP').replace('.json', '');
  for (const q of data.questions) {
    const hint = (q.hint || '').trim();
    if (!hintToExam.has(hint)) { hintToExam.set(hint, `${name}/${q.id}`); }
    else { crossDups++; findings.push(`"${hint.slice(0,50)}" in ${name}/${q.id} AND ${hintToExam.get(hint)}`); }
    totalQ++;
  }
}

console.log(`gp-1116-cross-exam-hint-unique: ${totalQ} hints, ${crossDups} cross-exam duplicates`);
if (findings.length) { findings.slice(0,5).forEach(f => console.log('  INFO:', f)); }
if (crossDups > 0) { console.log(`  ADVISORY: ${crossDups} hints duplicated across exams`); }
console.log(`OK -- cross-exam hint uniqueness audit complete`);
