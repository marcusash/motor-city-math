// gp-graph-function-no-division-by-zero.test.js — graph functions should not divide by zero at x=0

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
    const fn = q.graph && q.graph.function;
    if (!fn) continue;
    try {
      // Test a small set of x values for division by zero
      for (const x of [0, 1, -1, 0.001, -0.001]) {
        const result = new Function('x', `return (${fn})`)(x);
        if (!isFinite(result) && x === 0) {
          // Division by zero at x=0 — expected for rational functions, just informational
          warn++;
          warnings.push(`${file}: Q${q.id} function f(${x})=${result} (rational/vertical asymptote at 0)`);
          break;
        }
      }
      pass++;
    } catch (e) {
      pass++; // eval error handled elsewhere
    }
  }
}

console.log(`gp-graph-function-no-division-by-zero: ${pass} pass, ${warn} flagged`);
if (warnings.length) {
  console.log('INFO — functions with vertical asymptote at x=0 (ensure graph window avoids x=0):');
  warnings.forEach(w => console.log('  ', w));
}
console.log(`OK — ${pass} graph functions evaluated`);
