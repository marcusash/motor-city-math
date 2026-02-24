// gp-1515-rp12-solution-steps-count.test.js
// RP12 solution steps count is locked.

const fs = require('fs'), path = require('path');
const data = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data', 'retake-practice-12.json'), 'utf8'));
const total = data.questions.reduce((s, q) => s + (q.solution_steps || []).length, 0);
console.log('gp-1515-rp12-steps: ' + total + ' solution steps');
if (total >= 50) { console.log('OK -- RP12 has ' + total + ' solution steps (locked)'); }
else { console.log('FAIL: expected >=50, got ' + total); process.exit(1); }
