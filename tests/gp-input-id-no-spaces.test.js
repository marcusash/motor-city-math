// gp-input-id-no-spaces.test.js — input IDs must not contain spaces (would break HTML ID binding)

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
      if (typeof inp.id === 'string' && inp.id.includes(' ')) {
        fail++;
        issues.push(`${file}: Q${q.id} input id '${inp.id}' contains space`);
      } else {
        pass++;
      }
    }
  }
}

console.log(`gp-input-id-no-spaces: ${pass} pass, ${fail} fail`);
if (issues.length) {
  issues.forEach(i => console.log('  ', i));
  process.exit(1);
}
console.log(`OK — all ${pass} input IDs are space-free`);
