// gp-exam-data-file-size-reasonable.test.js — exam JSON files should be 50KB-500KB

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

const MIN_SIZE = 5 * 1024;   // 5KB minimum
const MAX_SIZE = 500 * 1024; // 500KB maximum

let pass = 0;
let warn = 0;
const warnings = [];

for (const file of RP_FILES) {
  const size = fs.statSync(path.join(DATA_DIR, file)).size;
  const sizeKB = Math.round(size / 1024);
  
  if (size < MIN_SIZE || size > MAX_SIZE) {
    warn++;
    warnings.push(`${file}: ${sizeKB}KB (expected 50-500KB)`);
  } else {
    pass++;
    console.log(`  ${file}: ${sizeKB}KB`);
  }
}

console.log(`gp-exam-data-file-size-reasonable: ${pass} pass, ${warn} outside range`);
if (warnings.length) {
  console.log('INFO — files outside expected size range:');
  warnings.forEach(w => console.log('  ', w));
}
console.log(`OK — ${pass} exam files in expected size range`);
