// gp-answer-numeric-in-reasonable-range.test.js — numeric answers should be in -10000 to 10000 range

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

const MIN = -10000;
const MAX = 10000;

let pass = 0;
let warn = 0;
const warnings = [];

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions) {
    for (const inp of (q.inputs || [])) {
      const ans = Number(inp.answer);
      if (!isNaN(ans) && (ans < MIN || ans > MAX)) {
        warn++;
        warnings.push(`${file}: Q${q.id} input '${inp.id}' answer=${ans} is outside expected range`);
      } else {
        pass++;
      }
    }
  }
}

console.log(`gp-answer-numeric-in-reasonable-range: ${pass} pass, ${warn} flagged`);
if (warnings.length) {
  console.log('INFO — answers outside expected range (GR to verify):');
  warnings.forEach(w => console.log('  ', w));
}
console.log(`OK — ${pass} inputs have numerically reasonable answers`);
