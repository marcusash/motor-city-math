// gp-1489-question-html-no-double-space.test.js
// question_html should not contain "  " (double spaces) -- catches copy-paste artifacts.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let checked = 0, flagged = 0; const flags = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions) {
    checked++;
    if (q.question_html && q.question_html.includes('  ')) {
      flagged++;
      if (flags.length < 5) flags.push(data.exam_id + ':' + q.id);
    }
  }
}
console.log('gp-1489-no-double-space: checked=' + checked + ' flagged=' + flagged);
if (flagged > 0) {
  console.log('  INFO (monitor): ' + flagged + ' questions have double spaces in question_html:');
  flags.forEach(f => console.log('    ' + f));
}
console.log('OK -- check complete, ' + flagged + ' flagged for GD review');
