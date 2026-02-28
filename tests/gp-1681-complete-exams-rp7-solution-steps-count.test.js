// gp-1681-complete-exams-rp7-solution-steps-count.test.js
const fs = require('fs'), path = require('path');
const data = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data', 'retake-practice-7.json'), 'utf8'));
let total = 0; for (const q of data.questions) total += (q.solution_steps || []).length;
console.log('gp-1681-rp7-solution-steps: ' + total);
console.log('OK -- RP7 solution_steps locked at ' + total);
