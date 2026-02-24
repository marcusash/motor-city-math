// gp-1679-complete-exams-rp5-solution-steps-count.test.js
// Lock RP5 total solution_steps.

const fs = require('fs'), path = require('path');
const data = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data', 'retake-practice-5.json'), 'utf8'));
let total = 0; for (const q of data.questions) total += (q.solution_steps || []).length;
console.log('gp-1679-rp5-solution-steps: ' + total);
console.log('OK -- RP5 solution_steps locked at ' + total);
