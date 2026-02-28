// gp-section-question-count.test.js
// Each section should have at least 2 questions — single-question sections suggest data entry error

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

const MIN_PER_SECTION = 2;

let pass = 0;
let warn = 0;
const warnings = [];

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  const counts = {};
  
  for (const q of data.questions) {
    const sec = q.section || 'unknown';
    counts[sec] = (counts[sec] || 0) + 1;
  }
  
  for (const [sec, count] of Object.entries(counts)) {
    if (count >= MIN_PER_SECTION) {
      pass++;
    } else {
      warn++;
      warnings.push(`${file}: Section ${sec} has only ${count} question(s)`);
    }
  }
}

console.log(`gp-section-question-count: ${pass} balanced sections, ${warn} thin sections`);
if (warnings.length) {
  console.log('INFO — thin sections (may indicate entry error):');
  warnings.forEach(w => console.log('  ', w));
}
console.log(`OK — ${pass} sections have ${MIN_PER_SECTION}+ questions`);
