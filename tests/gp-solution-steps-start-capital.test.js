// gp-solution-steps-start-capital.test.js — each solution step should start with a capital letter

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
      const text = (typeof step === 'string' ? step : (step.text || '')).trim();
      if (!text) continue;
      const first = text[0];
      // Allow: uppercase letters, digits, \, (, [, $ (math), ±, √
      const isOk = /^[A-Z0-9\\(\[\$±√]/.test(text);
      if (isOk) {
        pass++;
      } else {
        warn++;
        warnings.push(`${file}: Q${q.id} step ${i+1} starts lowercase: "${text.substring(0, 60)}"`);
      }
    }
  }
}

console.log(`gp-solution-steps-start-capital: ${pass} pass, ${warn} flagged`);
if (warnings.length) {
  console.log('INFO — steps starting lowercase (notify GR):');
  warnings.slice(0, 10).forEach(w => console.log('  ', w));
  if (warnings.length > 10) console.log(`  ... and ${warnings.length - 10} more`);
}
console.log(`OK — ${pass} solution steps start with capital/digit/math`);
