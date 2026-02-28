// gp-no-placeholder-answers.test.js — answer fields should not contain placeholder text like "TODO", "TBD", "FILL"

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

const PLACEHOLDER_PATTERNS = [/\bTODO\b/i, /\bTBD\b/i, /\bFILL\b/i, /\bPLACEHOLDER\b/i, /\bXXX\b/i, /\bNONE\b/i];

let pass = 0;
let fail = 0;
const issues = [];

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions) {
    for (const inp of (q.inputs || [])) {
      const ans = String(inp.answer || '');
      const isPlaceholder = PLACEHOLDER_PATTERNS.some(p => p.test(ans));
      if (isPlaceholder) {
        fail++;
        issues.push(`${file}: Q${q.id} '${inp.id}' answer='${ans}' looks like placeholder`);
      } else {
        pass++;
      }
    }
  }
}

console.log(`gp-no-placeholder-answers: ${pass} pass, ${fail} fail`);
if (issues.length) {
  issues.forEach(i => console.log('  ', i));
  process.exit(1);
}
console.log(`OK — ${pass} answer fields contain no placeholder text`);
