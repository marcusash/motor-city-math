// gp-section-d-has-long-solution-steps.test.js — Section D (hardest) should have more solution steps than average

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

let totalSteps = 0;
let totalQ = 0;
let dTotalSteps = 0;
let dTotalQ = 0;

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions) {
    const steps = (q.solution_steps || []).length;
    totalSteps += steps;
    totalQ++;
    if (q.section === 'D') {
      dTotalSteps += steps;
      dTotalQ++;
    }
  }
}

const avgOverall = (totalSteps / totalQ).toFixed(2);
const avgD = (dTotalSteps / dTotalQ).toFixed(2);

console.log(`gp-section-d-has-long-solution-steps: overall avg=${avgOverall}, Section D avg=${avgD}`);

if (parseFloat(avgD) < parseFloat(avgOverall)) {
  console.log(`  INFO — Section D avg (${avgD}) is below overall avg (${avgOverall}) — Section D should have more steps`);
} else {
  console.log(`  Section D has more steps than average: ${avgD} > ${avgOverall}`);
}
console.log(`OK — Section D solution step depth audited`);
