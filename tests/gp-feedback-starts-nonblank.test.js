// gp-feedback-starts-nonblank.test.js — both feedback fields must start with a non-blank character

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

let pass = 0, fail = 0;
const failures = [];

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions) {
    const fc = q.feedback_correct || '';
    const fw = q.feedback_wrong || '';
    const bad = [];
    if (fc.trimStart() === '') bad.push('feedback_correct is blank');
    if (fw.trimStart() === '') bad.push('feedback_wrong is blank');
    if (bad.length) {
      fail++;
      failures.push(`${file}: Q${q.id} — ${bad.join(', ')}`);
    } else { pass++; }
  }
}

console.log(`gp-feedback-starts-nonblank: ${pass} pass, ${fail} blank`);
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log(`OK — all ${pass} questions start with non-blank feedback text`);
