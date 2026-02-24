// gp-1946-complete-exams-tolerance-field-snapshot.test.js
// Discover which graphs have tolerance field and lock the count.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let withTol = 0, values = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  if (data.questions.length !== 15) continue;
  for (const q of data.questions) {
    if (!q.graph) continue;
    if (q.graph.tolerance !== undefined) { withTol++; values.push(q.graph.tolerance); }
  }
}
const unique = [...new Set(values)].sort();
console.log('gp-1946-tolerance-count:', withTol, 'unique values:', JSON.stringify(unique));
console.log('OK -- tolerance field discovery: '+withTol+' graphs have it, values='+JSON.stringify(unique));
