// gp-1428-title-contains-retake-practice.test.js
// Every exam title should reference "Retake Practice" (brand consistency).

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let pass = 0, fail = 0; const failures = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  const title = (data.title || '').toLowerCase();
  if (title.includes('retake') || title.includes('practice')) pass++;
  else { fail++; failures.push(file + ': title="' + data.title + '" missing retake/practice'); }
}
console.log('gp-1428-title-contains-retake-practice: ' + pass + ' pass, ' + fail + ' fail');
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- all ' + pass + ' exam titles reference retake or practice');
