// gp-hint-no-backticks.test.js — hints should not use backtick code formatting (not a coding context)

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
    const hint = q.hint || '';
    if (hint.includes('`')) {
      warn++;
      warnings.push(`${file}: Q${q.id} hint contains backtick: "${hint.substring(0, 60)}"`);
    } else {
      pass++;
    }
  }
}

console.log(`gp-hint-no-backticks: ${pass} pass, ${warn} flagged`);
if (warnings.length) {
  console.log('INFO — hints with backticks (use MathJax delimiters instead):');
  warnings.forEach(w => console.log('  ', w));
}
console.log(`OK — ${pass} hints have no backtick formatting`);
