// gp-solution-steps-word-count.test.js — each solution step should be under 50 words (ADHD readability)

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

const WORD_LIMIT = 50;

let pass = 0;
let warn = 0;
const warnings = [];

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions) {
    const steps = q.solution_steps || [];
    for (let i = 0; i < steps.length; i++) {
      const step = steps[i];
      const text = typeof step === 'string' ? step : (step.text || '');
      const wordCount = text.trim().split(/\s+/).filter(Boolean).length;
      if (wordCount > WORD_LIMIT) {
        warn++;
        warnings.push(`${file}: Q${q.id} step ${i + 1}: ${wordCount} words (limit: ${WORD_LIMIT})`);
      } else {
        pass++;
      }
    }
  }
}

console.log(`gp-solution-steps-word-count: ${pass} pass, ${warn} over-limit`);
if (warnings.length) {
  console.log(`INFO — steps over ${WORD_LIMIT}-word ADHD limit (not hard fail, notify GR):`);
  warnings.forEach(w => console.log('  ', w));
}
console.log(`OK — ${pass} steps within limit, ${warn} over limit`);
// Informational only — exit 0 (GR must rewrite verbose steps)
