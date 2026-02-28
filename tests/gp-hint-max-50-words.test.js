// gp-hint-max-50-words.test.js — hints should not exceed 50 words (ADHD: keep scaffolding tight)

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

const MAX_WORDS = 50;

let pass = 0;
let warn = 0;
const warnings = [];

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions) {
    const hint = (q.hint || '').trim();
    if (!hint) { pass++; continue; }
    const wordCount = hint.split(/\s+/).filter(w => w).length;
    if (wordCount > MAX_WORDS) {
      warn++;
      warnings.push(`${file}: Q${q.id} hint has ${wordCount} words (max ${MAX_WORDS}): "${hint.substring(0, 60)}..."`);
    } else {
      pass++;
    }
  }
}

console.log(`gp-hint-max-50-words: ${pass} pass, ${warn} over limit`);
if (warnings.length) {
  console.log('INFO — hints exceeding 50 words (GR to trim):');
  warnings.slice(0, 5).forEach(w => console.log('  ', w));
  if (warn > 5) console.log(`  ... and ${warn - 5} more`);
}
console.log(`OK — ${pass} hints within 50 words`);
