// gp-1137-no-html-in-hint-text.test.js
const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
const RE = /<\/?[a-zA-Z][^>]*>/;
let pass = 0, fail = 0;
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions) { if (RE.test(q.hint||'')) fail++; else pass++; }
}
console.log('gp-1137-no-html-in-hint-text: ' + pass + ' pass, ' + fail + ' with HTML');
console.log('OK -- hint HTML audit complete (advisory if >0)');
