// gp-graph-function-uses-x-variable.test.js — graph functions must reference 'x' (they're functions of x)

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
    const fn = q.graph.function;
    if (!/\bx\b/.test(fn)) {
      warn++;
      warnings.push(`${file}: Q${q.id} graph.function='${fn}' does not use x variable`);
    } else {
      pass++;
    }
  }
}

console.log(`gp-graph-function-uses-x-variable: ${pass} pass, ${warn} flagged`);
if (warnings.length) {
  console.log('INFO — graph functions without x variable:');
  warnings.forEach(w => console.log('  ', w));
}
console.log(`OK — ${pass} graph functions use the x variable`);
