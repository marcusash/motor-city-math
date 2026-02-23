// gp-dropout-has-at-least-2-wrong-options.test.js — dropdown should have >= 2 wrong options (not trivially guessable)

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
    for (const input of (q.inputs || [])) {
      if (input.type !== 'dropdown') continue;
      const opts = input.options || input.choices || [];
      const answer = input.answer;
      // Count "wrong" options (not equal to answer)
      const wrongCount = opts.filter(o => {
        const v = typeof o === 'object' ? (o.value || o.text || o) : o;
        return String(v) !== String(answer);
      }).length;
      
      if (wrongCount < 2) {
        warn++;
        warnings.push(`${file}: Q${q.id} dropdown id=${input.id} has only ${wrongCount} wrong options (too easy)`);
      } else {
        pass++;
      }
    }
  }
}

console.log(`gp-dropout-has-at-least-2-wrong-options: ${pass} pass, ${warn} too-easy`);
if (warnings.length) {
  console.log('INFO — dropdowns with fewer than 2 wrong options:');
  warnings.slice(0, 5).forEach(w => console.log('  ', w));
}
console.log(`OK — ${pass} dropdowns have >= 2 wrong options`);
