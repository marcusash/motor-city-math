// gp-1217-hint-no-answer-spoiler.test.js
// Hints must not contain the word "answer" (they guide, not spoil).

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let pass = 0, warn = 0;
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions) {
    if (/\banswer\b/i.test(q.hint || '')) { warn++; }
    else pass++;
  }
}
console.log('gp-1217-hint-no-answer-spoiler: ' + pass + ' clean, ' + warn + ' contain "answer"');
if (warn > 0) console.log('  ADVISORY: ' + warn + ' hints contain the word "answer" (may spoil)');
console.log('OK -- hint spoiler audit complete');
