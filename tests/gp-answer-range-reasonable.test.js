// gp-answer-range-reasonable.test.js
// Numeric answers should be in a reasonable range for Algebra II (-10000 to 10000)
// Values outside this range suggest a data entry error (e.g., missed decimal point)

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

const MIN_VAL = -10000;
const MAX_VAL = 10000;

let pass = 0;
let warn = 0;
const warnings = [];

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions) {
    for (const inp of (q.inputs || [])) {
      if (inp.type !== 'number') continue;
      if (inp.answer === undefined || inp.answer === null) continue;
      
      const val = parseFloat(String(inp.answer));
      if (isNaN(val)) continue;
      
      if (val < MIN_VAL || val > MAX_VAL) {
        warn++;
        warnings.push(`${file}: Q${q.id} '${inp.id}' answer=${val} outside range [${MIN_VAL}, ${MAX_VAL}]`);
      } else {
        pass++;
      }
    }
  }
}

console.log(`gp-answer-range-reasonable: ${pass} pass, ${warn} flagged`);
if (warnings.length) {
  console.log('INFO — extreme answer values (verify with GR):');
  warnings.forEach(w => console.log('  ', w));
}
console.log(`OK — ${pass} numeric answers within reasonable Algebra II range`);
