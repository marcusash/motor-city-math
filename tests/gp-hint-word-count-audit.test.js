// gp-hint-word-count-audit.test.js — audit hint word counts across all questions

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
let totalWords = 0;
let hintCount = 0;

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions) {
    const hint = (q.hint || '').trim();
    if (!hint) continue;
    const words = hint.split(/\s+/).length;
    totalWords += words;
    hintCount++;
    if (words > MAX_WORDS) {
      warn++;
      warnings.push(`${file}: Q${q.id} hint is ${words} words (>50)`);
    } else {
      pass++;
    }
  }
}

const avg = hintCount > 0 ? (totalWords / hintCount).toFixed(1) : 0;
console.log(`gp-hint-word-count-audit: ${pass} pass, ${warn} over limit`);
console.log(`  ${hintCount} hints, avg ${avg} words, max ${MAX_WORDS}`);
if (warnings.length) {
  console.log('INFO — hints over 50 words (ADHD limit):');
  warnings.slice(0, 5).forEach(w => console.log('  ', w));
}
console.log(`OK — ${pass} hints within ${MAX_WORDS}-word limit`);
