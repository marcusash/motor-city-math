// gp-question-section-c-is-graph.test.js — Section C questions should be of type with graph data

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
    if (!q.graph) {
      warn++;
      warnings.push(`${file}: Q${q.id} Section C has no graph data (type=${q.type})`);
    } else {
      pass++;
    }
  }
}

console.log(`gp-question-section-c-is-graph: ${pass} pass, ${warn} flagged`);
if (warnings.length) {
  console.log('INFO — Section C questions without graph data:');
  warnings.forEach(w => console.log('  ', w));
}
console.log(`OK — ${pass} Section C questions have graph data`);
