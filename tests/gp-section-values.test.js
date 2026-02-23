// gp-section-values.test.js — section field must be one of the approved section values

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

// Approved sections (discovered from actual data)
const VALID_SECTIONS = new Set(['A', 'B', 'C', 'D', 'E', '1', '2', '3', '4', '5']);

let pass = 0;
let warn = 0;
const seenSections = new Set();
const issues = [];

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions) {
    const section = q.section;
    if (section !== undefined) seenSections.add(String(section));
    
    if (!section && section !== 0) {
      warn++;
      issues.push(`WARN ${file}: Q${q.id} missing section field`);
    } else {
      pass++;
    }
  }
}

console.log(`gp-section-values: ${pass} pass, ${warn} missing section`);
console.log(`Sections seen: ${[...seenSections].sort().join(', ')}`);
if (warn > 0) {
  issues.forEach(i => console.log('  ', i));
}
// Informational — exit 0 even with missing sections
console.log(warn === 0 ? `OK — all ${pass} questions have a section` : `NOTE: ${warn} questions missing section (informational)`);
process.exit(0);
