// gp-exam-version-is-2x.test.js — exam version should be "2.0" or higher (v1 deprecated)

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

let pass = 0;
let warn = 0;
const warnings = [];
const versions = {};

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  const v = String(data.version || '').trim();
  versions[v] = (versions[v] || 0) + 1;
  
  const major = parseFloat(v);
  if (isNaN(major) || major < 2) {
    warn++;
    warnings.push(`${file}: version="${v}" is below 2.0 (use 2.0+)`);
  } else {
    pass++;
  }
}

console.log(`gp-exam-version-is-2x: ${pass} pass, ${warn} below 2.0`);
console.log(`  Version distribution: ${JSON.stringify(versions)}`);
if (warnings.length) {
  console.log('INFO — exams with version below 2.0:');
  warnings.forEach(w => console.log('  ', w));
}
console.log(`OK — ${pass} exams are on version 2.0+`);
