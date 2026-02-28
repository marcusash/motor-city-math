// gp-1193-w3-b-most-common-standard.test.js
// W3.b must be the most common standard (baseline: 34 questions).

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
const counts = {};
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions) { counts[q.standard] = (counts[q.standard]||0) + 1; }
}
const sorted = Object.entries(counts).sort((a,b)=>b[1]-a[1]);
const top = sorted[0];
const w3b = counts['W3.b'] || 0;
console.log('gp-1193-w3-b-most-common: W3.b=' + w3b + ', top=' + top[0] + '(' + top[1] + ')');
if (top[0] !== 'W3.b') { console.log('  FAIL: W3.b is not the most common standard'); process.exit(1); }
if (w3b !== 34) { console.log('  FAIL: W3.b count=' + w3b + ' (expected 34)'); process.exit(1); }
console.log('OK -- W3.b is the most common standard with 34 questions');
