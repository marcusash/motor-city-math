// gp-1518-rp12-no-duplicate-input-ids.test.js
// RP12 input ids must be unique within the exam.

const fs = require('fs'), path = require('path');
const data = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data', 'retake-practice-12.json'), 'utf8'));
const seen = new Set(); const dups = [];
for (const q of data.questions) {
  for (const inp of (q.inputs || [])) {
    if (seen.has(inp.id)) dups.push(inp.id + ' (in ' + q.id + ')');
    else seen.add(inp.id);
  }
}
console.log('gp-1518-rp12-unique-input-ids: ' + seen.size + ' unique, ' + dups.length + ' duplicates');
if (dups.length > 0) { dups.forEach(d => console.log('  FAIL:', d)); process.exit(1); }
console.log('OK -- RP12 has ' + seen.size + ' unique input ids (no duplicates)');
