// gp-2166-complete-exams-graph-y-range-field.test.js
// All graphs must have a y_range array [min, max] in all 12 exams.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let pass = 0, fail = 0; const failures = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  if (data.questions.length !== 15) continue;
  const graphQs = data.questions.filter(q => q.graph);
  const bad = graphQs.filter(q => !Array.isArray(q.graph.y_range) || q.graph.y_range.length !== 2);
  if (bad.length === 0) pass++;
  else { fail++; failures.push(data.exam_id + ' Q' + bad.map(q=>q.number).join(',') + ' missing/bad y_range'); }
}
console.log('gp-2166-graph-has-y-range: ' + pass + ' pass, ' + fail + ' fail');
if (fail > 0) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- All graphs have valid y_range in all 12 exams');
