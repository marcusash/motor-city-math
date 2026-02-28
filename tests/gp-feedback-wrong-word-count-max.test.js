// gp-feedback-wrong-word-count-max.test.js — feedback_wrong should not exceed 30 words (ADHD: not a wall of text)

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

const MAX_WORDS = 30;
let pass = 0;
let warn = 0;
const warnings = [];

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions) {
    const fw = String(q.feedback_wrong || '').trim();
    const words = fw.split(/\s+/).filter(w => w.length > 0).length;
    if (words > MAX_WORDS) {
      warn++;
      warnings.push(`${file}: Q${q.id} feedback_wrong is ${words} words (ADHD max: ${MAX_WORDS})`);
    } else {
      pass++;
    }
  }
}

console.log(`gp-feedback-wrong-word-count-max: ${pass} pass, ${warn} over-limit`);
if (warnings.length) {
  warnings.slice(0, 5).forEach(w => console.log('  INFO:', w));
  if (warnings.length > 5) console.log(`  ... and ${warnings.length - 5} more`);
}
console.log(`OK — ${pass} feedback_wrong fields within ${MAX_WORDS}-word ADHD limit`);
