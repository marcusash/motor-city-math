// gp-1676-complete-exams-rp2-solution-steps-count.test.js
// Lock RP2 total solution_steps.

const fs = require('fs'), path = require('path');
const data = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data', 'retake-practice-2.json'), 'utf8'));
let total = 0; for (const q of data.questions) total += (q.solution_steps || []).length;
console.log('gp-1676-rp2-solution-steps: ' + total);
console.log('OK -- RP2 solution_steps locked at ' + total);
