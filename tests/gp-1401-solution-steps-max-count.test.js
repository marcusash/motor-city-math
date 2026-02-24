// gp-1401-solution-steps-max-count.test.js
// Questions with > 6 solution steps are ADHD concerns (monitor, not hard fail — log count).

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let pass = 0, warn = 0;
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions) {
    const n = (q.solution_steps || []).length;
    if (n <= 6) pass++;
    else { warn++; console.log('  WARN: ' + file + ': ' + q.id + ' has ' + n + ' steps (ADHD concern, max 6)'); }
  }
}
console.log('gp-1401-solution-steps-max: ' + pass + ' ok, ' + warn + ' warn (>6 steps)');
console.log('OK -- ' + pass + ' questions at or below 6 steps; ' + warn + ' flagged for GR review');
