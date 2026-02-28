// gp-1926-complete-exams-plus-minus-schema-absent.test.js
// Schema discovery: plus_minus field is absent from all inputs.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let found = 0;
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  if (data.questions.length !== 15) continue;
  for (const q of data.questions) for (const inp of (q.inputs||[])) {
    if (Object.prototype.hasOwnProperty.call(inp, 'plus_minus')) found++;
  }
}
console.log('gp-1926-plus-minus-found:', found);
if (found !== 0) { console.log('UNEXPECTED: ' + found + ' inputs now have plus_minus -- update tests'); process.exit(1); }
console.log('OK -- plus_minus field absent from all inputs (schema advisory, 0 found as expected)');
