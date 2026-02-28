// gp-feedback-correct-no-curse-words.test.js — feedback_correct must not contain inappropriate language

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

// Basic inappropriate content patterns (content safety for Kai, age 15)
const INAPPROPRIATE = ['damn', 'hell', 'crap', 'stupid', 'dumb', 'idiot'];
let pass = 0;
let fail = 0;
const failures = [];

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions) {
    const fc = String(q.feedback_correct || '').toLowerCase();
    const fw = String(q.feedback_wrong || '').toLowerCase();
    const found = INAPPROPRIATE.filter(w => fc.includes(w) || fw.includes(w));
    if (found.length > 0) {
      fail++;
      failures.push(`${file}: Q${q.id} contains: ${found.join(', ')}`);
    } else {
      pass++;
    }
  }
}

console.log(`gp-feedback-correct-no-curse-words: ${pass} pass, ${fail} flagged`);
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log(`OK — all ${pass} questions have age-appropriate feedback language`);
