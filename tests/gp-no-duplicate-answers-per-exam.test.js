// gp-no-duplicate-answers-per-exam.test.js — detect if too many questions share the same numeric answer within one exam

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

const MAX_SAME_ANSWER_COUNT = 4; // More than 4 identical numeric answers = memorization risk

let pass = 0;
let warn = 0;
const issues = [];

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  const answerCounts = {};
  
  for (const q of data.questions) {
    for (const inp of (q.inputs || [])) {
      if (typeof inp.answer === 'number') {
        const key = String(inp.answer);
        answerCounts[key] = (answerCounts[key] || 0) + 1;
      }
    }
  }
  
  let examOk = true;
  for (const [ans, count] of Object.entries(answerCounts)) {
    if (count > MAX_SAME_ANSWER_COUNT) {
      warn++;
      issues.push(`${file}: answer ${ans} appears ${count} times (>${MAX_SAME_ANSWER_COUNT} — memorization risk)`);
      examOk = false;
    }
  }
  if (examOk) pass++;
}

console.log(`gp-no-duplicate-answers-per-exam: ${pass} pass, ${warn} exams with repeated answers (informational)`);
if (issues.length) {
  issues.forEach(i => console.log('  ', i));
  console.log('NOTE: Filed informational — GR to review for cross-exam answer patterns');
}
process.exit(0);
