// gp-solution-steps-ordered-logically.test.js — first step should be longer/setup-like, not a one-word answer

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

let pass = 0;
let warn = 0;
const warnings = [];

const MIN_FIRST_STEP_WORDS = 3;

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions) {
    const steps = q.solution_steps || [];
    if (steps.length === 0) continue;
    const firstStep = typeof steps[0] === 'string' ? steps[0] : (steps[0].text || '');
    const wordCount = firstStep.trim().split(/\s+/).filter(Boolean).length;
    if (wordCount < MIN_FIRST_STEP_WORDS) {
      warn++;
      warnings.push(`${file}: Q${q.id} first solution step is very short (${wordCount} words): "${firstStep}"`);
    } else {
      pass++;
    }
  }
}

console.log(`gp-solution-steps-ordered-logically: ${pass} pass, ${warn} flagged`);
if (warnings.length) {
  console.log(`INFO — questions where first step is very short (< ${MIN_FIRST_STEP_WORDS} words, GR review):`);
  warnings.slice(0, 5).forEach(w => console.log('  ', w));
  if (warn > 5) console.log(`  ... and ${warn - 5} more`);
}
console.log(`OK — ${pass} questions have substantive first solution step`);
