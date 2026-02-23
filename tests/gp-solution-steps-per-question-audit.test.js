// gp-solution-steps-per-question-audit.test.js — audit solution step counts per exam to find outliers

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

let totalSteps = 0;
let totalQuestions = 0;
const examStats = [];

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  let steps = 0;
  for (const q of data.questions) {
    steps += (q.solution_steps || []).length;
  }
  const avg = (steps / data.questions.length).toFixed(1);
  examStats.push({ file: file.replace('retake-practice-','RP').replace('.json',''), steps, avg });
  totalSteps += steps;
  totalQuestions += data.questions.length;
}

const overallAvg = (totalSteps / totalQuestions).toFixed(1);

console.log(`gp-solution-steps-per-question-audit: ${totalSteps} total steps / ${totalQuestions} questions = ${overallAvg} avg`);
examStats.forEach(e => console.log(`  ${e.file}: ${e.steps} steps, avg ${e.avg}/q`));

const minAvg = Math.min(...examStats.map(e => parseFloat(e.avg)));
const maxAvg = Math.max(...examStats.map(e => parseFloat(e.avg)));
console.log(`  Range: ${minAvg} - ${maxAvg} avg steps per question`);
console.log(`OK — solution step distribution audited`);
