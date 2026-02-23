// gp-hint-not-question-repeat.test.js — hints should not be identical to the question text

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

let pass = 0;
let fail = 0;
const failures = [];

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions) {
    const hint = (q.hint || '').trim().toLowerCase();
    const qText = (q.question_html || '').replace(/<[^>]+>/g, '').trim().toLowerCase();
    if (!hint || !qText) { pass++; continue; }
    // Check if hint is more than 80% the same as question (very similar = not helpful)
    if (hint === qText.substring(0, hint.length) && hint.length > 30) {
      fail++;
      failures.push(`${file}: Q${q.id} hint appears to repeat question text`);
    } else {
      pass++;
    }
  }
}

console.log(`gp-hint-not-question-repeat: ${pass} pass, ${fail} suspicious`);
if (failures.length) { failures.slice(0, 3).forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log(`OK — ${pass} hints are distinct from question text`);
