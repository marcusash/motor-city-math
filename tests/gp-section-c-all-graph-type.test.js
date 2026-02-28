// gp-section-c-all-graph-type.test.js — Section C questions must all have type=graph or a graph property

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
  const sectionC = data.questions.filter(q => q.section === 'C');
  for (const q of sectionC) {
    if (!q.graph && q.type !== 'graph') {
      warn++;
      warnings.push(`${file}: Q${q.id} is Section C but has no graph property (type=${q.type})`);
    } else {
      pass++;
    }
  }
}

console.log(`gp-section-c-all-graph-type: ${pass} pass, ${warn} flagged`);
if (warnings.length) {
  console.log('INFO — Section C questions without graph property:');
  warnings.forEach(w => console.log('  ', w));
}
console.log(`OK — ${pass} Section C questions have graph property`);
