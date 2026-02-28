// gp-solution-steps-total-word-count.test.js — total solution step word count per exam should be substantial

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

const MIN_WORDS_PER_EXAM = 300;

let pass = 0;
let warn = 0;
const warnings = [];

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  let totalWords = 0;
  for (const q of data.questions) {
    for (const step of (q.solution_steps || [])) {
      const text = typeof step === 'string' ? step : (step.text || '');
      totalWords += text.split(/\s+/).filter(Boolean).length;
    }
  }
  if (totalWords < MIN_WORDS_PER_EXAM) {
    warn++;
    warnings.push(`${file}: only ${totalWords} total words in solution steps (min: ${MIN_WORDS_PER_EXAM})`);
  } else {
    pass++;
  }
}

console.log(`gp-solution-steps-total-word-count: ${pass} pass, ${warn} flagged`);
if (warnings.length) {
  console.log('INFO — exams with sparse solution explanations:');
  warnings.forEach(w => console.log('  ', w));
}
console.log(`OK — ${pass} exams have ${MIN_WORDS_PER_EXAM}+ total words in solution steps`);
