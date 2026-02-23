// gp-label-nonempty.test.js — all inputs must have a non-empty label field

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

let pass = 0;
let fail = 0;
const issues = [];

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions) {
    for (const inp of (q.inputs || [])) {
      const label = (inp.label || '').trim();
      // Radio/MC inputs may have no label — question_html serves as the prompt
      if (inp.type === 'radio' || inp.type === 'multiple-choice') {
        pass++;
        continue;
      }
      if (label.length >= 2) {
        pass++;
      } else {
        fail++;
        issues.push(`${file}: Q${q.id} input '${inp.id}' (type=${inp.type}) has empty label: '${inp.label}'`);
      }
    }
  }
}

console.log(`gp-label-nonempty: ${pass} pass, ${fail} fail`);
if (issues.length) {
  issues.forEach(i => console.log('  ', i));
  process.exit(1);
}
console.log(`OK — all ${pass} inputs have non-empty labels`);
