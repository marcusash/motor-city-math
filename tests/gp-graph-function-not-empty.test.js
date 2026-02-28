// gp-graph-function-not-empty.test.js — graph.function field must be non-empty string

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

let pass = 0;
let fail = 0;
const issues = [];

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions) {
    if (!q.graph) continue;
    const fn = q.graph.function || '';
    if (fn.trim().length > 0) {
      pass++;
    } else {
      fail++;
      issues.push(`${file}: Q${q.id} graph.function is empty or missing`);
    }
  }
}

console.log(`gp-graph-function-not-empty: ${pass} pass, ${fail} fail`);
if (issues.length) {
  issues.forEach(i => console.log('  ', i));
  process.exit(1);
}
console.log(`OK — all ${pass} graphs have a non-empty function string`);
