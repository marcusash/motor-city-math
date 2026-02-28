// gp-answer-distribution-report.js — histogram of answer values per exam
// Flags cases where same answer appears many times (memorization risk for Kai)

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

const REPEAT_THRESHOLD = 3; // flag if same answer appears 3+ times in one exam

console.log('\n=== ANSWER DISTRIBUTION REPORT ===');
console.log('(Flags repeated answers that could let Kai memorize patterns)\n');

let totalRisks = 0;

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  const examLabel = file.replace('retake-practice-', 'RP').replace('.json', '');

  const counts = {};
  for (const q of data.questions) {
    for (const inp of (q.inputs || [])) {
      const ans = inp.answer;
      if (ans === null || ans === undefined || ans === '') continue;
      const key = String(ans).trim();
      counts[key] = (counts[key] || 0) + 1;
    }
  }

  const repeated = Object.entries(counts)
    .filter(([, n]) => n >= REPEAT_THRESHOLD)
    .sort((a, b) => b[1] - a[1]);

  if (repeated.length > 0) {
    console.log(`${examLabel}: ⚠️  REPEATED ANSWERS`);
    for (const [val, n] of repeated) {
      console.log(`  answer='${val}' appears ${n}x`);
      totalRisks++;
    }
  } else {
    // Show top 3 most common anyway for info
    const top = Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 3);
    console.log(`${examLabel}: ✅ max repeats=${top[0] ? top[0][1] : 0} (top: ${top.map(([v, n]) => `'${v}'x${n}`).join(', ')})`);
  }
}

console.log(`\nTotal repeated-answer risks: ${totalRisks}`);
if (totalRisks > 0) {
  console.log('GR: consider varying answers on flagged exams to prevent pattern memorization.');
} else {
  console.log('No critical memorization risks found.');
}
console.log();
