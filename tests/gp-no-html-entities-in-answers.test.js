// gp-no-html-entities-in-answers.test.js
// Answer fields should not contain HTML entities like &amp; &lt; &gt; — these suggest HTML crept into data

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

const HTML_ENTITY_RE = /&(amp|lt|gt|nbsp|quot|apos);/i;

let pass = 0;
let fail = 0;
const issues = [];

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions) {
    for (const inp of (q.inputs || [])) {
      if (inp.answer !== undefined && inp.answer !== null) {
        const ansStr = String(inp.answer);
        if (HTML_ENTITY_RE.test(ansStr)) {
          fail++;
          issues.push(`${file}: Q${q.id} '${inp.id}' answer has HTML entity: "${ansStr}"`);
        } else {
          pass++;
        }
      }
    }
  }
}

console.log(`gp-no-html-entities-in-answers: ${pass} pass, ${fail} fail`);
if (issues.length) {
  issues.forEach(i => console.log('  ', i));
  process.exit(1);
}
console.log(`OK — all ${pass} answers are HTML-entity-free`);
