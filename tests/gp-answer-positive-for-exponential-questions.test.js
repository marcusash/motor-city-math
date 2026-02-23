// gp-answer-positive-for-exponential-questions.test.js — exponential questions typically have positive answers

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
    if (q.type !== 'exponential') continue;
    for (const inp of (q.inputs || [])) {
      const ans = Number(inp.answer);
      if (!isNaN(ans) && ans < 0) {
        warn++;
        warnings.push(`${file}: Q${q.id} (exponential) '${inp.id}' answer=${ans} (negative, verify)`);
      } else {
        pass++;
      }
    }
  }
}

console.log(`gp-answer-positive-for-exponential-questions: ${pass} pass, ${warn} flagged`);
if (warnings.length) {
  console.log('INFO — negative answers in exponential questions (GR verify math):');
  warnings.forEach(w => console.log('  ', w));
}
console.log(`OK — ${pass} exponential question answers are non-negative`);
