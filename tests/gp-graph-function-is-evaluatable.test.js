// gp-graph-function-is-evaluatable.test.js — graph functions must be JS-evaluatable (no syntax errors)

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

let pass = 0, fail = 0;
const failures = [];

function tryParse(fn, label) {
  try {
    new Function('x', `return ${fn};`);
    return true;
  } catch (e) {
    return false;
  }
}

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions) {
    if (!q.graph || typeof q.graph.function !== 'string') continue;
    if (tryParse(q.graph.function, `${q.id}.function`)) { pass++; }
    else { fail++; failures.push(`${file}: ${q.id} graph.function has syntax error: "${q.graph.function.slice(0, 60)}"`); }
  }
}

console.log(`gp-graph-function-is-evaluatable: ${pass} pass, ${fail} fail`);
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log(`OK — all ${pass} graph functions are syntactically valid JS`);
