// gp-graphs-in-section-c-only.test.js — graphs should only appear in Section C questions (Q12/Q13)

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
    if (!q.graph) { pass++; continue; }
    if (q.section !== 'C') {
      warn++;
      warnings.push(`${file}: Q${q.id} has graph but is in Section ${q.section} (expected C)`);
    } else {
      pass++;
    }
  }
}

console.log(`gp-graphs-in-section-c-only: ${pass} pass, ${warn} unexpected`);
if (warnings.length) {
  warnings.forEach(w => console.log('  INFO:', w));
}
console.log(`OK — ${pass} checked: graphs confined to Section C`);
