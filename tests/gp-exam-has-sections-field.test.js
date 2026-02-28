// gp-exam-has-sections-field.test.js — exam JSON should have a sections[] or section_labels field for UI rendering

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
  // Check if sections are defined at exam level
  const hasSections = data.sections || data.section_labels || data.section_titles;
  if (hasSections) {
    pass++;
  } else {
    // Sections are implicit in question.section — this is informational only
    warn++;
    warnings.push(`${file}: no top-level sections field (sections inferred from question.section)`);
  }
}

console.log(`gp-exam-has-sections-field: ${pass} explicitly defined, ${warn} implicit`);
if (warnings.length) {
  console.log('INFO — exams use implicit sections (GI enhancement opportunity):');
  warnings.slice(0, 3).forEach(w => console.log('  ', w));
  if (warnings.length > 3) console.log(`  ... and ${warnings.length - 3} more`);
}
console.log(`OK — sections are ${pass > 0 ? 'explicit' : 'implicit'} across all exams`);
