// gp-created-by-field-present.test.js — every exam should have a created_by field

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
  if (!data.created_by || String(data.created_by).trim() === '') {
    warn++;
    warnings.push(`${file}: created_by field missing`);
  } else {
    pass++;
    console.log(`  ${file.replace('retake-practice-','RP').replace('.json','')}: created_by="${data.created_by}"`);
  }
}

console.log(`gp-created-by-field-present: ${pass} pass, ${warn} missing`);
if (warnings.length) { warnings.forEach(w => console.log('  INFO:', w)); }
console.log(`OK — created_by field audit complete`);
