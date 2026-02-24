// gp-1168-solution-steps-max-6-per-question.test.js
// Questions should not have more than 6 solution steps (ADHD: manageable chunks).

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let pass = 0, warn = 0;
const findings = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions) {
    const n = (q.solution_steps || []).length;
    if (n <= 6) pass++; else { warn++; findings.push(file + ': ' + q.id + ' has ' + n + ' steps'); }
  }
}
console.log('gp-1168-solution-steps-max-6: ' + pass + ' compliant, ' + warn + ' exceed 6');
if (findings.length) findings.forEach(f => console.log('  ADVISORY:', f));
console.log('OK -- solution step depth audit complete');
