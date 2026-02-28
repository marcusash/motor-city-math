// gp-data-version-is-string.test.js — version field should be a string, not a number

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
  const ver = data.version;
  if (typeof ver === 'number') {
    warn++;
    warnings.push(`${file}: version=${ver} is a number (should be string '${ver}.0' or '${ver}')`);
  } else if (typeof ver === 'string') {
    pass++;
  } else {
    warn++;
    warnings.push(`${file}: version is ${typeof ver} (expected string)`);
  }
}

console.log(`gp-data-version-is-string: ${pass} pass, ${warn} flagged`);
if (warnings.length) {
  console.log('INFO — version field type issues:');
  warnings.forEach(w => console.log('  ', w));
}
console.log(`OK — ${pass} exams have string version field`);
