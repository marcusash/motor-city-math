// gp-solution-steps-no-duplicate-across-questions.test.js — no two different questions should share identical solution steps

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
  const stepMap = {}; // step text -> question id
  
  for (const q of data.questions) {
    const steps = (q.solution_steps || []).map(s =>
      (typeof s === 'string' ? s : (s.text || '')).trim()
    ).filter(s => s.length > 30); // only long steps — short ones like "Simplify" are naturally shared

    for (const step of steps) {
      if (stepMap[step]) {
        warn++;
        if (warnings.length < 5) {
          warnings.push(`${file}: Q${q.id} and Q${stepMap[step]} share step: "${step.substring(0, 60)}..."`);
        }
      } else {
        stepMap[step] = q.id;
        pass++;
      }
    }
  }
}

console.log(`gp-solution-steps-no-duplicate-across-questions: ${pass} pass, ${warn} duplicates`);
if (warnings.length) {
  console.log('INFO — identical long solution steps across questions:');
  warnings.forEach(w => console.log('  ', w));
  if (warn > 5) console.log(`  ... and ${warn - 5} more`);
}
console.log(`OK — ${pass} unique solution steps checked`);
