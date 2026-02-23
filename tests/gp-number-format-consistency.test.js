// gp-number-format-consistency.test.js — numeric answers should use consistent precision
// Flags values like 2.500 (trailing zeros) or 1/3 as a string (should be decimal)

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

let pass = 0;
let warn = 0;
const issues = [];

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions) {
    for (const inp of (q.inputs || [])) {
      if (inp.type !== 'number' && inp.type !== 'text') continue;
      if (inp.answer === undefined || inp.answer === null) continue;
      
      const val = inp.answer;
      const str = String(val);
      
      // Fraction pattern — fractions as strings need to become decimals
      if (typeof val === 'string' && /^\d+\/\d+$/.test(val)) {
        warn++;
        issues.push(`${file}: Q${q.id} '${inp.id}' answer is fraction string '${val}' — should be decimal`);
      }
      // Trailing zeros on decimal: "2.500"
      else if (typeof val === 'string' && /\.\d*0$/.test(val)) {
        warn++;
        issues.push(`${file}: Q${q.id} '${inp.id}' has trailing zeros: '${val}'`);
      }
      else {
        pass++;
      }
    }
  }
}

console.log(`gp-number-format-consistency: ${pass} pass, ${warn} format issues`);
if (issues.length) {
  console.log('WARN — normalize number formats for auto-grading accuracy (GR domain):');
  issues.slice(0, 8).forEach(i => console.log('  ', i));
  if (issues.length > 8) console.log(`  ... and ${issues.length - 8} more`);
}
process.exit(0);
