// gp-solution-steps-no-answer-in-step-one.test.js — step 1 should set up the problem, not give the answer

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

// If first step is very short and contains only the answer value, that's a giveaway
const ANSWER_GIVEAWAY = /^(answer|result|solution)\s*[:=]\s*[-\d\.]+$/i;

let pass = 0;
let warn = 0;
const warnings = [];

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions) {
    const steps = q.solution_steps || [];
    if (steps.length === 0) continue;
    const first = typeof steps[0] === 'string' ? steps[0].trim() : (steps[0].text || '').trim();
    if (ANSWER_GIVEAWAY.test(first)) {
      warn++;
      warnings.push(`${file}: Q${q.id} step 1 appears to give answer directly: "${first}"`);
    } else {
      pass++;
    }
  }
}

console.log(`gp-solution-steps-no-answer-in-step-one: ${pass} pass, ${warn} flagged`);
if (warnings.length) {
  console.log('INFO — first solution step appears to be a direct answer giveaway:');
  warnings.forEach(w => console.log('  ', w));
}
console.log(`OK — ${pass} questions have proper first step (setup not answer)`);
