// gp-solution-steps-no-html-tags.test.js — solution steps should be plain text, not HTML

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

const HTML_TAG_PATTERN = /<[a-zA-Z][^>]*>/;

let pass = 0;
let warn = 0;
const warnings = [];

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions) {
    for (const step of (q.solution_steps || [])) {
      const text = typeof step === 'string' ? step : (step.text || '');
      if (HTML_TAG_PATTERN.test(text)) {
        warn++;
        warnings.push(`${file}: Q${q.id} step contains HTML: "${text.substring(0, 60)}"`);
      } else {
        pass++;
      }
    }
  }
}

console.log(`gp-solution-steps-no-html-tags: ${pass} pass, ${warn} with HTML`);
if (warnings.length) {
  console.log('INFO — solution steps with HTML tags (should be plain text):');
  warnings.slice(0, 5).forEach(w => console.log('  ', w));
  if (warn > 5) console.log(`  ... and ${warn - 5} more`);
}
console.log(`OK — ${pass} solution steps are plain text`);
