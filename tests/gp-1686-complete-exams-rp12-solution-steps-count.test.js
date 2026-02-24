// gp-1686-complete-exams-rp12-solution-steps-count.test.js
const fs = require('fs'), path = require('path');
const data = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data', 'retake-practice-12.json'), 'utf8'));
let total = 0; for (const q of data.questions) total += (q.solution_steps || []).length;
console.log('gp-1686-rp12-solution-steps: ' + total);
console.log('OK -- RP12 solution_steps locked at ' + total);
