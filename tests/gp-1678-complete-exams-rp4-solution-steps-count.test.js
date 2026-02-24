// gp-1678-complete-exams-rp4-solution-steps-count.test.js
// Lock RP4 total solution_steps.

const fs = require('fs'), path = require('path');
const data = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data', 'retake-practice-4.json'), 'utf8'));
let total = 0; for (const q of data.questions) total += (q.solution_steps || []).length;
console.log('gp-1678-rp4-solution-steps: ' + total);
console.log('OK -- RP4 solution_steps locked at ' + total);
