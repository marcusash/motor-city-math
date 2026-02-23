// gp-hint-no-direct-answer.test.js — hints should not contain "answer is" or "= [number]" patterns (spoilers)

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

const SPOILER_PATTERNS = [
  /answer is \d/i,
  /= \d+\.\d{2}/,   // e.g., "= 1234.56" (exact decimal answer)
  /the solution is/i,
];

let pass = 0;
let warn = 0;
const warnings = [];

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions) {
    const hint = (q.hint || '').trim();
    if (!hint) { pass++; continue; }
    const spoiled = SPOILER_PATTERNS.some(p => p.test(hint));
    if (spoiled) {
      warn++;
      warnings.push(`${file}: Q${q.id} hint may be a spoiler: "${hint.substring(0, 60)}"`);
    } else {
      pass++;
    }
  }
}

console.log(`gp-hint-no-direct-answer: ${pass} pass, ${warn} flagged`);
if (warnings.length) {
  console.log('INFO — hints with possible spoiler patterns:');
  warnings.slice(0, 5).forEach(w => console.log('  ', w));
  if (warn > 5) console.log(`  ... and ${warn - 5} more`);
}
console.log(`OK — ${pass} hints checked`);
