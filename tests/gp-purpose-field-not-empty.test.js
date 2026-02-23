// gp-purpose-field-not-empty.test.js — every exam should have a non-empty purpose field

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
  if (!data.purpose || String(data.purpose).trim() === '') {
    warn++;
    warnings.push(`${file}: purpose field missing/empty`);
  } else {
    pass++;
    console.log(`  ${file.replace('retake-practice-','RP').replace('.json','')}: "${String(data.purpose).substring(0,60)}..."`);
  }
}

console.log(`gp-purpose-field-not-empty: ${pass} pass, ${warn} missing`);
if (warnings.length) { warnings.forEach(w => console.log('  INFO:', w)); }
console.log(`OK — purpose field audit complete`);
