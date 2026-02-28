// gp-mc-has-options.test.js — verify all multiple-choice questions have at least 2 options with value+text

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
  const inputs = data.questions.flatMap(q => q.inputs || []);
  const mcInputs = inputs.filter(inp => inp.type === 'radio' || inp.type === 'multiple-choice');

  for (const inp of mcInputs) {
    const opts = inp.options || [];
    if (opts.length < 2) {
      fail++;
      issues.push(`${file}: MC input '${inp.id}' has only ${opts.length} option(s)`);
      continue;
    }
    let inputOk = true;
    for (const opt of opts) {
      if (!opt.value && opt.value !== 0) {
        fail++;
        issues.push(`${file}: MC input '${inp.id}' option missing 'value'`);
        inputOk = false;
      }
      if (!opt.text) {
        fail++;
        issues.push(`${file}: MC input '${inp.id}' option missing 'text'`);
        inputOk = false;
      }
    }
    if (inputOk) pass++;
  }
}

console.log(`gp-mc-has-options: ${pass} pass, ${fail} fail`);
if (issues.length) {
  issues.forEach(i => console.log('  ', i));
  process.exit(1);
}
console.log(`OK — all ${pass} MC inputs have valid options`);
