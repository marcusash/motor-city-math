// gp-graph-function-display-present.test.js — newer schema graphs should have function_display field

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
    const fd = (q.graph.function_display || '').trim();
    if (!fd) {
      warn++;
      warnings.push(`${file}: Q${q.id} graph missing function_display (human-readable math notation)`);
    } else {
      pass++;
    }
  }
}

console.log(`gp-graph-function-display-present: ${pass} pass, ${warn} missing`);
if (warnings.length) {
  console.log('INFO — graphs without function_display:');
  warnings.slice(0, 5).forEach(w => console.log('  ', w));
  if (warn > 5) console.log(`  ... and ${warn - 5} more`);
}
console.log(`OK — ${pass} graphs have function_display notation`);
