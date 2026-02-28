// gp-feedback-no-html-entities.test.js — feedback fields should use Unicode not HTML entities

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

const HTML_ENTITY = /&[a-zA-Z]+;|&#\d+;/;

let pass = 0;
let fail = 0;
const issues = [];

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions) {
    for (const field of ['feedback_correct', 'feedback_wrong']) {
      const val = q[field] || '';
      if (HTML_ENTITY.test(val)) {
        fail++;
        issues.push(`${file}: Q${q.id}.${field} contains HTML entity`);
      } else {
        pass++;
      }
    }
  }
}

console.log(`gp-feedback-no-html-entities: ${pass} pass, ${fail} fail`);
if (issues.length) {
  issues.forEach(i => console.log('  ', i));
  process.exit(1);
}
console.log(`OK — ${pass} feedback fields are HTML-entity free`);
