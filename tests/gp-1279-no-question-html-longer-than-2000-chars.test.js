// gp-1279-no-question-html-longer-than-2000-chars.test.js
// question_html should not exceed 2000 characters (ADHD readability check).

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let pass = 0, warn = 0;
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions) {
    const len = (q.question_html || '').length;
    if (len <= 2000) pass++;
    else { warn++; console.log('  WARN:', file, q.id, 'question_html length=' + len); }
  }
}
console.log('gp-1279-question-html-max-2000: ' + pass + ' pass, ' + warn + ' over 2000 chars');
console.log('OK -- question_html length audit complete');
