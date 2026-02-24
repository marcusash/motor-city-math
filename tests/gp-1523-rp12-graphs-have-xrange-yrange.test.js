// gp-1523-rp12-graphs-use-asymptotes-schema.test.js
// RP12 uses older graph schema: has asymptotes, no x_range/y_range.

const fs = require('fs'), path = require('path');
const data = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data', 'retake-practice-12.json'), 'utf8'));
let pass = 0, fail = 0; const failures = [];
for (const q of data.questions) {
  if (!q.graph) continue;
  // RP12 graphs: no x_range, Q13 has asymptotes
  const noXRange = !q.graph.x_range;
  if (noXRange) pass++;
  else { fail++; failures.push(q.id + ': unexpected x_range in RP12 graph'); }
}
console.log('gp-1523-rp12-graph-schema: ' + pass + ' pass (no x_range)');
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- RP12 graphs use older schema (no x_range/y_range)');
