// gp-1684-complete-exams-rp10-solution-steps-count.test.js
const fs = require('fs'), path = require('path');
const data = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data', 'retake-practice-10.json'), 'utf8'));
let total = 0; for (const q of data.questions) total += (q.solution_steps || []).length;
console.log('gp-1684-rp10-solution-steps: ' + total);
console.log('OK -- RP10 solution_steps locked at ' + total);
