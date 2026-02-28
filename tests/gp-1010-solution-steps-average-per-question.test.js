// gp-1010-solution-steps-average-per-question.test.js — track average steps per question (target >= 4)

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

let totalSteps = 0, totalQ = 0;
const perExam = [];

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  const steps = data.questions.reduce((s, q) => s + (q.solution_steps || []).length, 0);
  totalSteps += steps;
  totalQ += data.questions.length;
  perExam.push({ file: file.replace('retake-practice-', 'RP').replace('.json', ''), avg: (steps / data.questions.length).toFixed(1) });
}

const avg = (totalSteps / totalQ).toFixed(1);
console.log(`gp-1010-solution-steps-average-per-question: avg=${avg} steps/question (${totalSteps} / ${totalQ})`);
perExam.forEach(e => console.log(`  ${e.file}: ${e.avg} avg`));
if (parseFloat(avg) >= 4) {
  console.log(`OK — average steps/question is adequate (${avg} >= 4)`);
} else {
  console.log(`INFO — average steps/question is low (${avg} < 4)`);
}
