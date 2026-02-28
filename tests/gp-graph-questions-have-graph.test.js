// gp-graph-questions-have-graph.test.js — questions of type 'graph' must have a graph field

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
    if (q.type !== 'graph') continue;
    if (q.graph && typeof q.graph === 'object') {
      pass++;
    } else {
      fail++;
      issues.push(`${file}: Q${q.id} has type='graph' but no 'graph' field`);
    }
  }
}

console.log(`gp-graph-questions-have-graph: ${pass} pass, ${fail} fail`);
if (issues.length) {
  issues.forEach(i => console.log('  ', i));
  process.exit(1);
}
console.log(`OK — all ${pass} graph-type questions have a graph field`);
