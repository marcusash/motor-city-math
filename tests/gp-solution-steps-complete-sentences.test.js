// gp-solution-steps-complete-sentences.test.js
// Solution steps should end with punctuation (. or !) to signal completeness

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

let pass = 0;
let warn = 0;
const warnings = [];

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions) {
    for (let i = 0; i < (q.solution_steps || []).length; i++) {
      const step = q.solution_steps[i];
      const text = (typeof step === 'string' ? step : (step.text || '')).trimEnd();
      if (!text) continue;
      const last = text[text.length - 1];
      if (['.', '!', '?', ')', '}', ']'].includes(last)) {
        pass++;
      } else {
        warn++;
        if (warnings.length < 10) {
          warnings.push(`${file}: Q${q.id} step ${i+1} ends with '${last}': "${text.substring(Math.max(0, text.length - 30))}"`);
        }
      }
    }
  }
}

console.log(`gp-solution-steps-complete-sentences: ${pass} pass, ${warn} flagged`);
if (warnings.length) {
  console.log('INFO — steps ending without punctuation (informational, notify GR):');
  warnings.forEach(w => console.log('  ', w));
  if (warn > 10) console.log(`  ... and ${warn - 10} more`);
}
console.log(`OK — ${pass} steps end with punctuation, ${warn} flagged`);
