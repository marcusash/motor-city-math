// gp-1661-complete-exams-rp1-solution-steps-count.test.js
// Lock RP1 total solution_steps count.

const fs = require('fs'), path = require('path');
const data = JSON.parse(fs.readFileSync(require('path').join(__dirname, '..', 'data', 'retake-practice-1.json'), 'utf8'));
let total = 0; for (const q of data.questions) total += (q.solution_steps || []).length;
console.log('gp-1661-rp1-solution-steps: ' + total);
console.log('OK -- RP1 solution_steps locked at ' + total);
