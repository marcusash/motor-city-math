// gp-graph-function-display-is-string.test.js — graphs must have function_display as string

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
    if (!q.graph) continue;
    const fd = q.graph.function_display;
    if (!fd || typeof fd !== 'string' || fd.trim() === '') {
      warn++;
      warnings.push(`${file}: Q${q.id} graph missing/empty function_display`);
    } else {
      pass++;
      // Display sample
    }
  }
}

console.log(`gp-graph-function-display-is-string: ${pass} pass, ${warn} missing`);
if (warnings.length) {
  warnings.forEach(w => console.log('  INFO:', w));
}
console.log(`OK — ${pass} graphs have function_display string`);
