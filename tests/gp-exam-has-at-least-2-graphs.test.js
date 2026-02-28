// gp-exam-has-at-least-2-graphs.test.js — each exam should have at least 2 graph questions (Section C)

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

let pass = 0;
let fail = 0;
const failures = [];

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  const graphQuestions = data.questions.filter(q => q.graph);
  if (graphQuestions.length < 2) {
    fail++;
    failures.push(`${file}: only ${graphQuestions.length} graph questions (expected >= 2)`);
  } else {
    pass++;
    console.log(`  ${file}: ${graphQuestions.length} graph questions`);
  }
}

console.log(`gp-exam-has-at-least-2-graphs: ${pass} pass, ${fail} fail`);
if (failures.length) {
  failures.forEach(f => console.log('  FAIL:', f));
  process.exit(1);
}
console.log(`OK — all ${pass} exams have 2+ graph questions`);
