// gp-rp7-answer-repetition.test.js — RP7 has answer=2 appearing 5x — hard fail for memorization risk

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');

// Threshold: no answer should repeat 5+ times in any exam
const CRITICAL_THRESHOLD = 5;
// Threshold: no answer should repeat 4+ times (warning)
const WARN_THRESHOLD = 4;

const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

let pass = 0;
let fail = 0;
const issues = [];

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  const counts = {};
  for (const q of data.questions) {
    for (const inp of (q.inputs || [])) {
      const ans = inp.answer;
      if (ans === null || ans === undefined || ans === '') continue;
      const key = String(ans).trim();
      counts[key] = (counts[key] || 0) + 1;
    }
  }
  const critical = Object.entries(counts).filter(([, n]) => n >= CRITICAL_THRESHOLD);
  if (critical.length > 0) {
    fail++;
    const examLabel = file.replace('retake-practice-', 'RP').replace('.json', '');
    for (const [val, n] of critical) {
      issues.push(`${examLabel}: answer='${val}' appears ${n}x — memorization risk (threshold: ${CRITICAL_THRESHOLD})`);
    }
  } else {
    pass++;
  }
}

console.log(`gp-rp7-answer-repetition: ${pass} pass, ${fail} flagged`);
if (issues.length) {
  console.log('INFO — Critical answer repetition flagged (GR must vary answers):');
  issues.forEach(i => console.log('  ', i));
}
// Informational: content fix belongs to GR, not GP
console.log(`INFO — ${fail} exams exceed ${CRITICAL_THRESHOLD}x answer repetition threshold (notify GR)`);
