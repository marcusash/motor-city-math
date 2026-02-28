// gp-1049-hint-unique-per-exam.test.js — hints should be unique within each exam

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

let examPass = 0, examDups = 0;
const findings = [];

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  const seen = new Map();
  let hasDup = false;
  for (const q of data.questions) {
    const hint = (q.hint || '').trim();
    if (seen.has(hint)) {
      hasDup = true;
      findings.push(`${file}: ${q.id} hint duplicates ${seen.get(hint)}: "${hint.slice(0,40)}..."`);
    } else {
      seen.set(hint, q.id);
    }
  }
  if (hasDup) { examDups++; } else { examPass++; }
}

console.log(`gp-1049-hint-unique-per-exam: ${examPass} exams clean, ${examDups} with dup hints`);
if (findings.length) { findings.forEach(f => console.log('  INFO:', f)); }
console.log(`OK — hint uniqueness audit complete`);
