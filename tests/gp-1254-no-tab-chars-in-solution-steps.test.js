// gp-1254-no-tab-chars-in-solution-steps.test.js
// Solution steps should not contain raw tab characters (formatting concern).

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let pass = 0, warn = 0;
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions) {
    for (const step of (q.solution_steps || [])) {
      if (/\t/.test(step)) { warn++; console.log('  WARN:', file, q.id, 'step contains tab'); }
      else pass++;
    }
  }
}
console.log('gp-1254-no-tab-in-steps: ' + pass + ' clean, ' + warn + ' with tabs');
console.log('OK -- solution step tab audit complete');
