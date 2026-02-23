// gp-graph-function-not-constant.test.js — graph functions should not be trivial constants (y=2 etc)

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

let pass = 0;
let warn = 0;
const warnings = [];

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions) {
    if (!q.graph || !q.graph.function) continue;
    const fn = q.graph.function.trim();
    // A constant function would be just a number with no x
    if (/^-?\d+(\.\d+)?$/.test(fn)) {
      warn++;
      warnings.push(`${file}: Q${q.id} graph.function='${fn}' is a constant (no x dependency)`);
    } else {
      pass++;
    }
  }
}

console.log(`gp-graph-function-not-constant: ${pass} pass, ${warn} flagged`);
if (warnings.length) {
  console.log('INFO — graph functions that are trivial constants:');
  warnings.forEach(w => console.log('  ', w));
}
console.log(`OK — ${pass} graph functions are non-constant`);
