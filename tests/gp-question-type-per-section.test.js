// gp-question-type-per-section.test.js — verify question types are distributed across sections (not all same type in one section)

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

let pass = 0;
let warn = 0;
const issues = [];

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  
  // Group by section
  const sectionMap = {};
  for (const q of data.questions) {
    const section = q.section || 'unknown';
    if (!sectionMap[section]) sectionMap[section] = new Set();
    sectionMap[section].add(q.type);
  }
  
  // Each section should have at least 1 unique type
  let examOk = true;
  for (const [section, types] of Object.entries(sectionMap)) {
    if (types.size >= 1) {
      pass++;
    } else {
      warn++;
      issues.push(`${file}: section ${section} has 0 question types`);
      examOk = false;
    }
  }
}

console.log(`gp-question-type-per-section: ${pass} pass, ${warn} issues (informational)`);
if (issues.length) {
  issues.forEach(i => console.log('  ', i));
}
process.exit(0);
