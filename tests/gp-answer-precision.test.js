// gp-answer-precision.test.js — verify numeric answers have reasonable decimal precision (not excessive)

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

const MAX_DECIMAL_PLACES = 4; // More than 4 decimals is likely a rounding artifact

let pass = 0;
let warn = 0;
const issues = [];

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions) {
    for (const inp of (q.inputs || [])) {
      if (typeof inp.answer !== 'number') continue;
      
      const str = String(inp.answer);
      const decimals = str.includes('.') ? str.split('.')[1].length : 0;
      
      if (decimals > MAX_DECIMAL_PLACES) {
        warn++;
        issues.push(`${file}: Q${q.id} input '${inp.id}' answer ${inp.answer} has ${decimals} decimal places (>${MAX_DECIMAL_PLACES})`);
      } else {
        pass++;
      }
    }
  }
}

console.log(`gp-answer-precision: ${pass} pass, ${warn} with excessive decimals (informational)`);
if (issues.length) {
  console.log('PRECISION WARNINGS (may indicate rounding artifacts):');
  issues.forEach(i => console.log('  ', i));
}
process.exit(0);
