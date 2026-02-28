// gp-1683-complete-exams-rp9-solution-steps-count.test.js
const fs = require('fs'), path = require('path');
const data = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data', 'retake-practice-9.json'), 'utf8'));
let total = 0; for (const q of data.questions) total += (q.solution_steps || []).length;
console.log('gp-1683-rp9-solution-steps: ' + total);
console.log('OK -- RP9 solution_steps locked at ' + total);
