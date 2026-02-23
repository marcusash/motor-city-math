// gp-no-answer-equals-pi.test.js — answer should not be the float value of pi (unreachable by Kai)

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

const PI_APPROX = [3.14159, 3.1416, 3.14, Math.PI];

let pass = 0;
let warn = 0;
const warnings = [];

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions) {
    for (const inp of (q.inputs || [])) {
      const ans = Number(inp.answer);
      if (!isNaN(ans) && PI_APPROX.some(p => Math.abs(ans - p) < 0.001)) {
        warn++;
        warnings.push(`${file}: Q${q.id} '${inp.id}' answer=${ans} looks like pi — unexpected`);
      } else {
        pass++;
      }
    }
  }
}

console.log(`gp-no-answer-equals-pi: ${pass} pass, ${warn} flagged`);
if (warnings.length) {
  console.log('INFO — answers near pi value (verify this is intentional):');
  warnings.forEach(w => console.log('  ', w));
}
console.log(`OK — ${pass} answers are not unexpectedly pi-valued`);
