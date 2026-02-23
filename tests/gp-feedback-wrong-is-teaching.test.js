// gp-feedback-wrong-is-teaching.test.js — feedback_wrong should be educational (min 5 words)

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

const MIN_WORDS = 5;
let pass = 0;
let warn = 0;
const warnings = [];

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions) {
    const fw = String(q.feedback_wrong || '').trim();
    const words = fw.split(/\s+/).filter(w => w.length > 0).length;
    if (words < MIN_WORDS) {
      warn++;
      warnings.push(`${file}: Q${q.id} feedback_wrong too short (${words} words): "${fw}"`);
    } else {
      pass++;
    }
  }
}

console.log(`gp-feedback-wrong-is-teaching: ${pass} pass, ${warn} too short`);
if (warnings.length) {
  console.log('INFO — feedback_wrong under 5 words (not educational enough):');
  warnings.slice(0, 5).forEach(w => console.log('  ', w));
}
console.log(`OK — ${pass} feedback_wrong fields have >= ${MIN_WORDS} words`);
