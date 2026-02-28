// gp-1795-complete-exams-graph-required-fields.test.js
// Graph objects must have: function OR graph_type, key_points, canvas_id.
// All 24 graphs use 'function' field (not graph_type) -- this is the correct schema.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let pass = 0, fail = 0; const failures = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  if (data.questions.length !== 15) continue;
  for (const q of data.questions) {
    if (!q.graph) continue;
    const hasFn = q.graph.function !== undefined || q.graph.graph_type !== undefined;
    const hasKP = Array.isArray(q.graph.key_points) && q.graph.key_points.length > 0;
    const hasCI = typeof q.graph.canvas_id === 'string' && q.graph.canvas_id.length > 0;
    if (hasFn && hasKP && hasCI) pass++;
    else {
      fail++;
      if (!hasFn) failures.push(data.exam_id + ':' + q.id + ' graph missing function/graph_type');
      if (!hasKP) failures.push(data.exam_id + ':' + q.id + ' graph missing key_points');
      if (!hasCI) failures.push(data.exam_id + ':' + q.id + ' graph missing canvas_id');
    }
  }
}
console.log('gp-1795-graph-required-fields: ' + pass + ' pass, ' + fail + ' fail');
if (fail > 0) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- all 24 graph objects have function/graph_type, key_points, canvas_id (' + pass + ' graphs)');
