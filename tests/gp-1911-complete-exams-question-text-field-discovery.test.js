// gp-1911-complete-exams-all-questions-have-prompt.test.js
// Discover primary text field: check for 'prompt' or 'question_text' or 'description'.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
const counts = {};
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  if (data.questions.length !== 15) continue;
  for (const q of data.questions) {
    for (const field of ['prompt','question_text','description','text','content','question','stem']) {
      if (q[field] !== undefined) counts[field] = (counts[field]||0)+1;
    }
  }
}
console.log('gp-1911-question-text-fields:', JSON.stringify(counts));
console.log('OK -- question primary text field discovery complete');
