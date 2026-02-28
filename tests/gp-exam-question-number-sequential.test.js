// gp-exam-question-number-sequential.test.js — questions should have sequential numbers in their IDs

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
  const examNum = file.match(/retake-practice-(\d+)\.json/)[1];
  const nums = data.questions.map(q => {
    const m = q.id.match(/q(\d+)$/);
    return m ? parseInt(m[1]) : null;
  }).filter(n => n !== null);

  if (nums.length !== data.questions.length) {
    warn++;
    warnings.push(`${file}: some question IDs don't end with a number`);
    continue;
  }

  const sorted = [...nums].sort((a, b) => a - b);
  const isSequential = sorted.every((n, i) => n === i + 1);
  if (isSequential) {
    pass++;
  } else {
    warn++;
    warnings.push(`${file}: question numbers not 1-15 sequential: ${sorted.join(', ')}`);
  }
}

console.log(`gp-exam-question-number-sequential: ${pass} pass, ${warn} flagged`);
if (warnings.length) {
  warnings.forEach(w => console.log('  ', w));
}
console.log(`OK — ${pass} exams have sequential question numbering`);
