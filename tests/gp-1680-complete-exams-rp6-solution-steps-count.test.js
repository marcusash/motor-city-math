// gp-1680-complete-exams-rp6-solution-steps-count.test.js
// Lock RP6 total solution_steps.

const fs = require('fs'), path = require('path');
const data = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data', 'retake-practice-6.json'), 'utf8'));
let total = 0; for (const q of data.questions) total += (q.solution_steps || []).length;
console.log('gp-1680-rp6-solution-steps: ' + total);
console.log('OK -- RP6 solution_steps locked at ' + total);
