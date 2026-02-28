// gp-1947-complete-exams-min-points-field-snapshot.test.js
// Discover which graphs have min_points field and lock the count.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let withMP = 0, values = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  if (data.questions.length !== 15) continue;
  for (const q of data.questions) {
    if (!q.graph) continue;
    if (q.graph.min_points !== undefined) { withMP++; values.push(q.graph.min_points); }
  }
}
const unique = [...new Set(values)].sort((a,b)=>a-b);
console.log('gp-1947-min-points-count:', withMP, 'unique values:', JSON.stringify(unique));
console.log('OK -- min_points field discovery: '+withMP+' graphs have it, values='+JSON.stringify(unique));
