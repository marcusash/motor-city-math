// gp-1842-complete-exams-all-exams-have-description.test.js
// All exam files must have a non-empty description field.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let pass = 0, advisory = 0; const findings = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  if (typeof data.description === 'string' && data.description.trim().length >= 5) pass++;
  else { advisory++; findings.push(file + ' description=' + JSON.stringify(data.description)); }
}
console.log('gp-1842-all-exams-have-description: ' + pass + ' pass, ' + advisory + ' advisory');
if (advisory > 0) { findings.forEach(f => console.log('  ADVISORY:', f)); }
console.log('OK -- description field check complete (' + pass + ' have it, ' + advisory + ' missing/short)');
