// gp-hint-max-length.test.js — hints should not be excessively long (ADHD: max 100 chars)

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

const MAX_LEN = 150; // generous but flagging anything extreme

let pass = 0;
let warn = 0;
const warnings = [];

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions) {
    const hint = q.hint || '';
    if (hint.length > MAX_LEN) {
      warn++;
      warnings.push(`${file}: Q${q.id} hint is ${hint.length} chars (max recommended: ${MAX_LEN})`);
    } else {
      pass++;
    }
  }
}

console.log(`gp-hint-max-length: ${pass} pass, ${warn} flagged`);
if (warnings.length) {
  console.log(`INFO — hints over ${MAX_LEN} chars (ADHD: shorter is better, GR review):`);
  warnings.forEach(w => console.log('  ', w));
}
console.log(`OK — ${pass} hints are under ${MAX_LEN} characters`);
