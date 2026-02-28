// gp-dropout-answers-numeric-or-keyword.test.js — dropdown answers should be numeric or a short keyword

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
    for (const inp of (q.inputs || [])) {
      if (inp.type !== 'dropdown' || inp.answer === undefined) continue;
      const ans = String(inp.answer).trim();
      const wordCount = ans.split(/\s+/).length;
      if (wordCount > 6) {
        warn++;
        warnings.push(`${file}: Q${q.id} dropdown answer is long (${wordCount} words): "${ans.substring(0, 40)}"`);
      } else {
        pass++;
      }
    }
  }
}

console.log(`gp-dropout-answers-numeric-or-keyword: ${pass} pass, ${warn} long`);
if (warnings.length) {
  console.log('INFO — dropdown answers with more than 6 words:');
  warnings.forEach(w => console.log('  ', w));
}
console.log(`OK — ${pass} dropdown answers are concise`);
