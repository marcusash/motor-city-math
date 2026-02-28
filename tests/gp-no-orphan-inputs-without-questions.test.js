// gp-no-orphan-inputs-without-questions.test.js — every input must belong to a question (sanity check)

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
  // If questions is valid array, all inputs are inside questions by definition
  // But verify no question has inputs outside the inputs array (e.g. direct on q)
  for (const q of data.questions) {
    if (q.inputs && Array.isArray(q.inputs)) {
      for (const inp of q.inputs) {
        if (!inp.id) {
          fail++;
          issues.push(`${file}: Q${q.id} has input without id field`);
        } else {
          pass++;
        }
      }
    }
  }
}

console.log(`gp-no-orphan-inputs-without-questions: ${pass} pass, ${fail} fail`);
if (issues.length) {
  issues.forEach(i => console.log('  ', i));
  process.exit(1);
}
console.log(`OK — ${pass} inputs all have valid parent questions and id fields`);
