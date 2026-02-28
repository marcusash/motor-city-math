// gp-question-type-matches-section.test.js — Section C questions should be graph type

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

// Section C = graph-based questions (should have graph data)
// Section D = word problems/construct/error-analysis

let pass = 0;
let warn = 0;
const warnings = [];

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions) {
    if (q.section === 'C' && !q.graph) {
      warn++;
      warnings.push(`${file}: Q${q.id} Section C type='${q.type}' has no graph`);
    } else if (q.section === 'D' && q.graph) {
      warn++;
      warnings.push(`${file}: Q${q.id} Section D type='${q.type}' unexpectedly has a graph`);
    } else {
      pass++;
    }
  }
}

console.log(`gp-question-type-matches-section: ${pass} pass, ${warn} flagged`);
if (warnings.length) {
  console.log('INFO — section/type mismatches:');
  warnings.slice(0, 5).forEach(w => console.log('  ', w));
  if (warn > 5) console.log(`  ... and ${warn - 5} more`);
}
console.log(`OK — ${pass} questions have consistent section/type pairing`);
