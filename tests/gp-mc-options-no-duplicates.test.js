// gp-mc-options-no-duplicates.test.js — multiple-choice and dropdown options must be unique within each input

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
      const options = inp.options || [];
      if (options.length === 0) continue;
      
      const seen = new Set();
      let hasDup = false;
      for (const opt of options) {
        const key = typeof opt === 'string' ? opt : opt.value || opt.label || JSON.stringify(opt);
        if (seen.has(key)) {
          hasDup = true;
          issues.push(`${file}: Q${q.id} '${inp.id}' has duplicate option: '${key}'`);
        }
        seen.add(key);
      }
      
      if (!hasDup) {
        pass++;
      } else {
        fail++;
      }
    }
  }
}

console.log(`gp-mc-options-no-duplicates: ${pass} pass, ${fail} fail`);
if (issues.length) {
  issues.forEach(i => console.log('  ', i));
  process.exit(1);
}
console.log(`OK — all ${pass} choice inputs have unique options`);
