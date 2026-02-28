// gp-no-curly-quotes-answers.test.js — answer fields should not contain curly/smart quotes

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

// Curly/smart quote characters
const CURLY_QUOTES = ['\u2018', '\u2019', '\u201C', '\u201D']; // ' ' " "

let pass = 0;
let fail = 0;
const issues = [];

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions) {
    for (const inp of (q.inputs || [])) {
      if (inp.answer !== undefined && inp.answer !== null) {
        const ansStr = String(inp.answer);
        const hasCurly = CURLY_QUOTES.some(ch => ansStr.includes(ch));
        if (hasCurly) {
          fail++;
          issues.push(`${file}: Q${q.id} '${inp.id}' answer has curly quote: "${ansStr}"`);
        } else {
          pass++;
        }
      }
    }
  }
}

console.log(`gp-no-curly-quotes-answers: ${pass} pass, ${fail} fail`);
if (issues.length) {
  issues.forEach(i => console.log('  ', i));
  process.exit(1);
}
console.log(`OK — all ${pass} answers use straight quotes`);
