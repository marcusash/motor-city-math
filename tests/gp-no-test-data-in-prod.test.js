// gp-no-test-data-in-prod.test.js — ensure no test/placeholder answers exist in production RP files

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

// Known test/placeholder values to detect
const PLACEHOLDER_ANSWERS = new Set([999, -999, 1234, 9999]);
const PLACEHOLDER_STRINGS = ['TODO', 'FIXME', 'TBD', 'placeholder', 'test', 'xxx'];

let pass = 0;
let fail = 0;
const issues = [];

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions) {
    for (const inp of (q.inputs || [])) {
      const ans = inp.answer;
      if (ans === undefined || ans === null) continue;
      
      if (typeof ans === 'number' && PLACEHOLDER_ANSWERS.has(ans)) {
        fail++;
        issues.push(`${file}: Q${q.id} input '${inp.id}' has suspicious placeholder answer: ${ans}`);
      } else if (typeof ans === 'string') {
        const upper = ans.toUpperCase();
        if (PLACEHOLDER_STRINGS.some(s => upper.includes(s))) {
          fail++;
          issues.push(`${file}: Q${q.id} input '${inp.id}' has placeholder-like answer: '${ans}'`);
        } else {
          pass++;
        }
      } else {
        pass++;
      }
    }
  }
}

console.log(`gp-no-test-data-in-prod: ${pass} pass, ${fail} fail`);
if (issues.length) {
  issues.forEach(i => console.log('  ', i));
  process.exit(1);
}
console.log(`OK — no placeholder/test answers detected in ${pass} inputs`);
