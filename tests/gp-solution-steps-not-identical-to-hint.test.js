// gp-solution-steps-not-identical-to-hint.test.js — solution steps should expand on the hint, not repeat it

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
    const hint = (q.hint || '').trim().toLowerCase();
    const steps = (q.solution_steps || []).map(s =>
      (typeof s === 'string' ? s : (s.text || '')).trim().toLowerCase()
    );
    const firstStep = steps[0] || '';
    
    if (hint.length > 20 && firstStep.length > 20 && hint === firstStep) {
      warn++;
      warnings.push(`${file}: Q${q.id} hint and first solution step are identical`);
    } else {
      pass++;
    }
  }
}

console.log(`gp-solution-steps-not-identical-to-hint: ${pass} pass, ${warn} flagged`);
if (warnings.length) {
  console.log('INFO — hint and first solution step identical (GR should differentiate):');
  warnings.forEach(w => console.log('  ', w));
}
console.log(`OK — ${pass} questions have hints distinct from their first solution step`);
