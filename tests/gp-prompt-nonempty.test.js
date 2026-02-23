// gp-prompt-nonempty.test.js — all question prompts are non-empty strings
// Empty prompts would leave Kai with a blank question — unacceptable UX

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();

let pass = 0;
let fail = 0;
const violations = [];

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  const questions = data.questions || [];
  for (const q of questions) {
    const promptFields = ['prompt', 'question', 'question_html'];
    let hasPrompt = false;
    for (const field of promptFields) {
      if (q[field] !== undefined) {
        hasPrompt = true;
        if (typeof q[field] !== 'string' || q[field].trim().length === 0) {
          fail++;
          violations.push(`${file} Q${q.id || q.number} .${field} is empty or non-string`);
        } else {
          pass++;
        }
        break; // first matching prompt field is sufficient
      }
    }
    if (!hasPrompt) {
      fail++;
      violations.push(`${file} Q${q.id || q.number} has no prompt/question/question_html field`);
    }
  }
}

console.log(`gp-prompt-nonempty: ${pass} pass, ${fail} fail`);
if (violations.length) {
  console.log('VIOLATIONS:');
  violations.forEach(v => console.log('  ', v));
  process.exit(1);
}
console.log('OK — all prompts are non-empty strings');
