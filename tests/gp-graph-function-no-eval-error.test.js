// gp-graph-function-no-eval-error.test.js — graph functions must be valid JS that can be eval'd with x=0

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

let pass = 0;
let fail = 0;
const failures = [];

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions) {
    if (!q.graph || !q.graph.function) continue;
    const fn = q.graph.function;
    try {
      // eslint-disable-next-line no-new-func
      const result = new Function('x', `return (${fn})`)(0);
      if (result === null || result === undefined || (typeof result !== 'number' && isNaN(result))) {
        fail++;
        failures.push(`${file}: Q${q.id} graph.function='${fn}' returned non-numeric: ${result}`);
      } else {
        pass++;
      }
    } catch (e) {
      fail++;
      failures.push(`${file}: Q${q.id} graph.function='${fn}' eval error: ${e.message}`);
    }
  }
}

console.log(`gp-graph-function-no-eval-error: ${pass} pass, ${fail} fail`);
if (failures.length) {
  failures.forEach(f => console.log('  FAIL:', f));
  process.exit(1);
}
console.log(`OK — all ${pass} graph functions eval without error at x=0`);
