// gp-answer-diversity-per-exam.test.js — each exam should not have the same answer for more than 4 questions

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

const MAX_SAME_ANSWER = 5;

let pass = 0;
let warn = 0;
const warnings = [];

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  const answerCounts = {};
  
  for (const q of data.questions) {
    for (const inp of (q.inputs || [])) {
      if (inp.answer === undefined || inp.answer === null) continue;
      const ans = String(inp.answer).trim();
      if (!ans) continue;
      answerCounts[ans] = (answerCounts[ans] || 0) + 1;
    }
  }
  
  const highFreq = Object.entries(answerCounts)
    .filter(([, count]) => count > MAX_SAME_ANSWER)
    .sort((a, b) => b[1] - a[1]);
  
  if (highFreq.length > 0) {
    warn++;
    warnings.push(`${file}: answer '${highFreq[0][0]}' appears ${highFreq[0][1]}x`);
  } else {
    pass++;
  }
}

console.log(`gp-answer-diversity-per-exam: ${pass} pass, ${warn} low-diversity`);
if (warnings.length) {
  console.log('INFO — exams with repeated answers (memorization risk):');
  warnings.forEach(w => console.log('  ', w));
}
console.log(`OK — ${pass} exams have diverse answer sets`);
