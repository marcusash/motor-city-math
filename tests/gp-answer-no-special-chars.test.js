// gp-answer-no-special-chars.test.js — answers shouldn't contain special chars that break grading ($, %, comma)

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

const SPECIAL_CHARS = /[$,%]/;

let pass = 0;
let warn = 0;
const warnings = [];

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions) {
    for (const inp of (q.inputs || [])) {
      const ans = String(inp.answer || '');
      if (SPECIAL_CHARS.test(ans)) {
        warn++;
        warnings.push(`${file}: Q${q.id} input '${inp.id}' answer='${ans}' contains special chars`);
      } else {
        pass++;
      }
    }
  }
}

console.log(`gp-answer-no-special-chars: ${pass} pass, ${warn} flagged`);
if (warnings.length) {
  console.log('INFO — answers with special chars (may break parseFloat grading):');
  warnings.forEach(w => console.log('  ', w));
}
console.log(`OK — ${pass} inputs have clean answer strings`);
