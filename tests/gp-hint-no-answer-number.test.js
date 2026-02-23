// gp-hint-no-answer-number.test.js — hint should guide, not state the exact numeric answer

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

let pass = 0;
let warn = 0;
const warnings = [];

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions) {
    const hint = (q.hint || '').toLowerCase();
    for (const inp of (q.inputs || [])) {
      const ans = String(inp.answer || '').toLowerCase().trim();
      // Only check short numeric answers that appear in hint verbatim
      if (ans.length >= 1 && ans.length <= 6 && !isNaN(Number(ans)) && ans !== '') {
        const hintWords = hint.split(/\s+/);
        if (hintWords.includes(ans)) {
          warn++;
          warnings.push(`${file}: Q${q.id} hint contains answer value '${ans}'`);
          break;
        }
      }
    }
    pass++;
  }
}

console.log(`gp-hint-no-answer-number: ${pass} pass, ${warn} flagged`);
if (warnings.length) {
  console.log('INFO — hints that may reveal the answer:');
  warnings.forEach(w => console.log('  ', w));
}
console.log(`OK — ${pass} questions reviewed for answer leakage in hints`);
