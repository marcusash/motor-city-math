// gp-no-zero-answer.test.js — answer=0 is almost never correct in algebra 2 (usually indicates data error)

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
    for (const inp of (q.inputs || [])) {
      const ans = inp.answer;
      if (ans === 0 || ans === '0') {
        warn++;
        warnings.push(`${file}: Q${q.id} input '${inp.id}' has answer=0 — verify this is intentional`);
      } else {
        pass++;
      }
    }
  }
}

console.log(`gp-no-zero-answer: ${pass} pass, ${warn} flagged`);
if (warnings.length) {
  console.log('INFO — inputs with answer=0 (GR should verify):');
  warnings.forEach(w => console.log('  ', w));
}
console.log(`OK — ${pass} inputs reviewed for zero-answer`);
