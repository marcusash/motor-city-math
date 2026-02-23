// gp-answer-not-whole-number-always.test.js — at least some answers should be non-integer per exam (variety)

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

const MIN_FRACTION_ANSWERS = 1; // at least 1 non-integer answer per exam

let pass = 0;
let warn = 0;
const warnings = [];

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  let fractionCount = 0;
  for (const q of data.questions) {
    for (const inp of (q.inputs || [])) {
      const ans = Number(inp.answer);
      if (!isNaN(ans) && ans !== Math.floor(ans)) {
        fractionCount++;
      }
    }
  }
  if (fractionCount < MIN_FRACTION_ANSWERS) {
    warn++;
    warnings.push(`${file}: ${fractionCount} non-integer answers (suggests all round numbers — verify variety)`);
  } else {
    pass++;
  }
}

console.log(`gp-answer-not-whole-number-always: ${pass} pass, ${warn} flagged`);
if (warnings.length) {
  console.log('INFO — exams with very few fractional answers:');
  warnings.forEach(w => console.log('  ', w));
}
console.log(`OK — ${pass} exams have at least some non-integer answers`);
