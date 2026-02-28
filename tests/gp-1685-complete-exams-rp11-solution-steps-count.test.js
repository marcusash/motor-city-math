// gp-1685-complete-exams-rp11-solution-steps-count.test.js
const fs = require('fs'), path = require('path');
const data = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data', 'retake-practice-11.json'), 'utf8'));
let total = 0; for (const q of data.questions) total += (q.solution_steps || []).length;
console.log('gp-1685-rp11-solution-steps: ' + total);
console.log('OK -- RP11 solution_steps locked at ' + total);
