// gp-feedback-correct-not-too-long.test.js — more specific: feedback_correct under 120 chars (voice guide: max 12 words)

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

const MAX_WORDS = 20; // generous ADHD limit

let pass = 0;
let warn = 0;
const warnings = [];

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions) {
    const fc = (q.feedback_correct || '').trim();
    const wordCount = fc.split(/\s+/).filter(w => w).length;
    if (wordCount > MAX_WORDS) {
      warn++;
      warnings.push(`${file}: Q${q.id} feedback_correct=${wordCount} words (max ${MAX_WORDS}): "${fc.substring(0, 60)}"`);
    } else {
      pass++;
    }
  }
}

console.log(`gp-feedback-correct-not-too-long: ${pass} pass, ${warn} flagged`);
if (warnings.length) {
  console.log(`INFO — correct feedback over ${MAX_WORDS} words (ADHD: keep short):`) ;
  warnings.slice(0, 5).forEach(w => console.log('  ', w));
  if (warn > 5) console.log(`  ... and ${warn - 5} more`);
}
console.log(`OK — ${pass} questions have feedback within word limit`);
