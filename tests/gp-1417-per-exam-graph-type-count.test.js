// gp-1417-per-exam-graph-type-count.test.js
// RP1-10 have 2 "graph" type questions (Q12 and Q13). RP11 has 1 (Q13 is rational).

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
let pass = 0, fail = 0; const failures = [];
for (let n = 1; n <= 10; n++) {
  const file = 'retake-practice-' + n + '.json';
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  const count = data.questions.filter(q => q.type === 'graph').length;
  if (count === 2) pass++;
  else { fail++; failures.push(file + ': graph type count=' + count + ' (expected 2)'); }
}
// RP11 Q13 is type=rational, so only 1 graph-type question
const rp11 = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'retake-practice-11.json'), 'utf8'));
const rp11Count = rp11.questions.filter(q => q.type === 'graph').length;
if (rp11Count === 1) pass++;
else { fail++; failures.push('retake-practice-11.json: graph type count=' + rp11Count + ' (expected 1, RP11 Q13 is rational)'); }
console.log('gp-1417-graph-type-count: ' + pass + ' pass, ' + fail + ' fail');
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- RP1-10 have 2 graph-type each, RP11 has 1 (Q13=rational)');
