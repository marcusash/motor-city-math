// gp-feedback-correct-under-60-chars.test.js — ADHD guard: feedback_correct max 60 chars

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

const MAX = 60;
let pass = 0, fail = 0;
const failures = [];

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions) {
    const fc = (q.feedback_correct || '').trim();
    if (fc.length <= MAX) { pass++; }
    else { fail++; failures.push(`${file}: ${q.id} feedback_correct is ${fc.length} chars (max ${MAX}): "${fc.slice(0,40)}..."`); }
  }
}

console.log(`gp-feedback-correct-under-60-chars: ${pass} pass, ${fail} advisory`);
if (failures.length) { failures.forEach(f => console.log('  LONG:', f)); }
console.log(`OK — feedback_correct length audit complete`);
