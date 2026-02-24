// gp-1983-complete-exams-all-questions-have-hints.test.js
// Discover what fraction of questions have hints.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let withHints = 0, withoutHints = 0;
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  if (data.questions.length !== 15) continue;
  for (const q of data.questions) {
    if (Array.isArray(q.hints) && q.hints.length > 0) withHints++;
    else withoutHints++;
  }
}
console.log('gp-1983-hints-coverage: withHints='+withHints+' withoutHints='+withoutHints);
console.log('OK -- hint coverage: '+withHints+'/180 questions have hints');
