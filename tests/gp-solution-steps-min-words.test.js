// gp-solution-steps-min-words.test.js — each solution step should be at least 4 words long

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

const MIN_WORDS = 4;

let pass = 0;
let warn = 0;
const warnings = [];

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions) {
    for (const step of (q.solution_steps || [])) {
      const text = (typeof step === 'string' ? step : (step.text || '')).trim();
      const wordCount = text.split(/\s+/).filter(w => w.length > 0).length;
      if (wordCount < MIN_WORDS) {
        warn++;
        warnings.push(`${file}: Q${q.id} step too short (${wordCount} words): "${text}"`);
      } else {
        pass++;
      }
    }
  }
}

console.log(`gp-solution-steps-min-words: ${pass} pass, ${warn} flagged`);
if (warnings.length) {
  console.log('INFO — solution steps with fewer than 4 words:');
  warnings.slice(0, 5).forEach(w => console.log('  ', w));
  if (warn > 5) console.log(`  ... and ${warn - 5} more`);
}
console.log(`OK — ${pass} steps have at least ${MIN_WORDS} words`);
