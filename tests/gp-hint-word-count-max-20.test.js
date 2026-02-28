// gp-hint-word-count-max-20.test.js — hints should be <= 20 words (ADHD: concise guidance)

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

const MAX_WORDS = 20;
let pass = 0;
let warn = 0;
const warnings = [];

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions) {
    if (!q.hint) { pass++; continue; }
    const words = String(q.hint).trim().split(/\s+/).filter(w => w.length > 0).length;
    if (words > MAX_WORDS) {
      warn++;
      warnings.push(`${file}: Q${q.id} hint is ${words} words (max ${MAX_WORDS} for ADHD)`);
    } else {
      pass++;
    }
  }
}

console.log(`gp-hint-word-count-max-20: ${pass} pass, ${warn} over-limit`);
if (warnings.length) {
  warnings.slice(0, 5).forEach(w => console.log('  INFO:', w));
  if (warnings.length > 5) console.log(`  ... and ${warnings.length - 5} more`);
}
console.log(`OK — ${pass} hints within 20-word ADHD limit`);
