// gp-hint-word-count.test.js — hints should be 5-30 words (ADHD: concise but useful)

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

const MIN_WORDS = 5;
const MAX_WORDS = 30;

let pass = 0;
let warn = 0;
const warnings = [];

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions) {
    const hint = q.hint || '';
    const words = hint.trim().split(/\s+/).filter(Boolean).length;
    if (words < MIN_WORDS) {
      warn++;
      warnings.push(`${file}: Q${q.id} hint too short (${words} words): "${hint}"`);
    } else if (words > MAX_WORDS) {
      warn++;
      warnings.push(`${file}: Q${q.id} hint too long (${words} words): "${hint.substring(0, 60)}..."`);
    } else {
      pass++;
    }
  }
}

console.log(`gp-hint-word-count: ${pass} pass, ${warn} out-of-range`);
if (warnings.length) {
  console.log('INFO — hint word count issues (notify GR):');
  warnings.forEach(w => console.log('  ', w));
}
console.log(`OK — ${pass} hints within 5-30 word range`);
