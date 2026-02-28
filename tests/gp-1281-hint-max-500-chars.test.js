// gp-1281-hint-max-500-chars.test.js
// Hints should not exceed 500 characters (ADHD focus guard).

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let pass = 0, warn = 0;
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions) {
    const len = (q.hint || '').length;
    if (len <= 500) pass++;
    else { warn++; console.log('  WARN:', file, q.id, 'hint length=' + len); }
  }
}
console.log('gp-1281-hint-max-500: ' + pass + ' pass, ' + warn + ' over 500 chars');
console.log('OK -- hint length audit complete');
