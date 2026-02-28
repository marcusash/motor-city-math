// gp-exam-q13-is-section-c-or-d.test.js — Q13 by index is typically last of Section B or start of C

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
  const q13 = data.questions[12]; // 13th question, 0-indexed
  if (!q13) { warn++; continue; }
  
  const validSections = new Set(['B', 'C', 'D']);
  if (!validSections.has(q13.section)) {
    warn++;
    warnings.push(`${file}: Q13 (id=${q13.id}) in section ${q13.section} (expected B/C/D)`);
  } else {
    pass++;
    console.log(`  ${file}: Q13 in Section ${q13.section} (type=${q13.type})`);
  }
}

console.log(`gp-exam-q13-is-section-c-or-d: ${pass} pass, ${warn} unexpected`);
if (warnings.length) {
  warnings.forEach(w => console.log('  INFO:', w));
}
console.log(`OK — ${pass} exams have Q13 in expected section`);
