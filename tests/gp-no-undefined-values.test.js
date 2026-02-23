// gp-no-undefined-values.test.js — detect 'undefined' as a string value in JSON fields

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

const FIELDS_TO_CHECK = ['question_html', 'hint', 'feedback_correct', 'feedback_wrong', 'answer', 'label'];

let pass = 0;
let fail = 0;
const issues = [];

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions) {
    for (const field of FIELDS_TO_CHECK) {
      const val = q[field];
      if (val === 'undefined' || val === 'null') {
        fail++;
        issues.push(`${file}: Q${q.id}.${field} = '${val}' (string 'undefined'/'null')`);
      } else {
        pass++;
      }
    }
    for (const inp of (q.inputs || [])) {
      for (const field of ['label', 'answer']) {
        const val = inp[field];
        if (val === 'undefined' || val === 'null') {
          fail++;
          issues.push(`${file}: Q${q.id} input '${inp.id}'.${field} = '${val}'`);
        } else {
          pass++;
        }
      }
    }
  }
}

console.log(`gp-no-undefined-values: ${pass} pass, ${fail} fail`);
if (issues.length) {
  issues.forEach(i => console.log('  ', i));
  process.exit(1);
}
console.log(`OK — no 'undefined' or 'null' string values found in data fields`);
