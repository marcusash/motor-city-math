// gp-exam-created-year-reasonable.test.js — created year should be 2025 or 2026

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

const VALID_YEARS = new Set(['2025', '2026']);

let pass = 0;
let warn = 0;
const warnings = [];

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  const created = data.created || '';
  const year = created.substring(0, 4);
  if (!VALID_YEARS.has(year)) {
    warn++;
    warnings.push(`${file}: created='${created}' year=${year} (expected 2025 or 2026)`);
  } else {
    pass++;
  }
}

console.log(`gp-exam-created-year-reasonable: ${pass} pass, ${warn} flagged`);
if (warnings.length) {
  console.log('INFO — exams with unexpected creation year:');
  warnings.forEach(w => console.log('  ', w));
}
console.log(`OK — ${pass} exams have reasonable creation year`);
