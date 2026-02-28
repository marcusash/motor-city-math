// gp-exam-subtitle-present.test.js — all RP files should have a subtitle field for context

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
  const subtitle = (data.subtitle || '').trim();
  if (subtitle.length >= 5) {
    pass++;
    console.log(`  OK: ${file} — "${subtitle}"`);
  } else {
    warn++;
    issues.push(`${file}: subtitle is missing or too short: '${subtitle}'`);
  }
}

console.log(`gp-exam-subtitle-present: ${pass} pass, ${warn} missing/short`);
if (issues.length) {
  issues.forEach(i => console.log('  WARN:', i));
}
process.exit(0);
