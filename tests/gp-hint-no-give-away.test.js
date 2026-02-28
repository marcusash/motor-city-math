// gp-hint-no-give-away.test.js — hints should not contain exact answer values
// A hint that says "the answer is 7" defeats the purpose

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

// Patterns that strongly suggest an answer giveaway in hint text
const GIVEAWAY_PATTERNS = [
  /the answer is/i,
  /answer[:=]\s*\d/i,
  /equals\s+\d+\s*$/i,
  /solution is/i,
  /result is\s+\d/i
];

let pass = 0;
let warn = 0;
const warnings = [];

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions) {
    const hint = q.hint || '';
    const hasGiveaway = GIVEAWAY_PATTERNS.some(p => p.test(hint));
    if (hasGiveaway) {
      warn++;
      warnings.push(`${file}: Q${q.id} hint may reveal answer: "${hint.substring(0, 80)}"`);
    } else {
      pass++;
    }
  }
}

console.log(`gp-hint-no-give-away: ${pass} pass, ${warn} flagged`);
if (warnings.length) {
  console.log('INFO — hints that may reveal the answer (GR review):');
  warnings.forEach(w => console.log('  ', w));
}
console.log(`OK — ${pass} hints do not contain obvious answer giveaways`);
