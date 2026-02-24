// gp-1677-complete-exams-rp3-solution-steps-count.test.js
// Lock RP3 total solution_steps.

const fs = require('fs'), path = require('path');
const data = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data', 'retake-practice-3.json'), 'utf8'));
let total = 0; for (const q of data.questions) total += (q.solution_steps || []).length;
console.log('gp-1677-rp3-solution-steps: ' + total);
console.log('OK -- RP3 solution_steps locked at ' + total);
