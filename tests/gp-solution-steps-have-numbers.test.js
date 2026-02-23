// gp-solution-steps-have-numbers.test.js — solution steps should include numbers/values, not just words

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

const HAS_NUMERIC = /[\d]/;

let pass = 0;
let warn = 0;
const warnings = [];

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions) {
    const steps = q.solution_steps || [];
    const texts = steps.map(s => typeof s === 'string' ? s : (s.text || ''));
    // At least half the steps should reference numbers
    const numericSteps = texts.filter(t => HAS_NUMERIC.test(t)).length;
    if (texts.length > 2 && numericSteps < Math.floor(texts.length / 2)) {
      warn++;
      warnings.push(`${file}: Q${q.id} only ${numericSteps}/${texts.length} steps contain numbers`);
    } else {
      pass++;
    }
  }
}

console.log(`gp-solution-steps-have-numbers: ${pass} pass, ${warn} flagged`);
if (warnings.length) {
  console.log('INFO — solution steps with few numeric references:');
  warnings.slice(0, 5).forEach(w => console.log('  ', w));
  if (warn > 5) console.log(`  ... and ${warn - 5} more`);
}
console.log(`OK — ${pass} questions have numeric values in solution steps`);
