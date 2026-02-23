// gp-section-c-is-graph-type.test.js — Section C questions should typically be graphing type

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
    if (q.section !== 'C') continue;
    if (q.type === 'graph' || q.graph) {
      pass++;
    } else {
      warn++;
      warnings.push(`${file}: Q${q.id} is Section C but type='${q.type}' (not graph)`);
    }
  }
}

console.log(`gp-section-c-is-graph-type: ${pass} pass, ${warn} flagged`);
if (warnings.length) {
  console.log('INFO — Section C questions that are not graph type:');
  warnings.forEach(w => console.log('  ', w));
}
console.log(`OK — ${pass} Section C questions are graph type`);
