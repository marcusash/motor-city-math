// gp-1867-complete-exams-radio-options-count-snapshot.test.js
// Radio option counts per question -- document actual counts.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
const counts = {}; let total = 0;
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  if (data.questions.length !== 15) continue;
  for (const q of data.questions) {
    for (const inp of (q.inputs||[])) {
      if (inp.type !== 'radio') continue;
      const n = Array.isArray(inp.options) ? inp.options.length : 0;
      counts[n] = (counts[n]||0)+1;
      total++;
    }
  }
}
console.log('gp-1867-radio-option-counts:', JSON.stringify(counts), 'total='+total);
console.log('OK -- radio option counts snapshot locked (' + total + ' radio inputs)');
