// gp-exam-json-size-reasonable.test.js — each exam JSON should be a reasonable size (not empty or bloated)

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

const MIN_SIZE = 10000;  // at least 10KB (15 questions with data)
const MAX_SIZE = 200000; // at most 200KB (reasonable cap)

let pass = 0;
let fail = 0;
const failures = [];

for (const file of RP_FILES) {
  const fullPath = path.join(DATA_DIR, file);
  const size = fs.statSync(fullPath).size;
  const sizeKB = (size / 1024).toFixed(1);
  
  if (size < MIN_SIZE) {
    fail++;
    failures.push(`${file}: ${sizeKB}KB is too small (min ${MIN_SIZE/1024}KB) — possible data loss`);
  } else if (size > MAX_SIZE) {
    fail++;
    failures.push(`${file}: ${sizeKB}KB exceeds max ${MAX_SIZE/1024}KB — possible bloat`);
  } else {
    pass++;
    console.log(`  ${file.replace('retake-practice-','RP').replace('.json','')}: ${sizeKB}KB`);
  }
}

console.log(`gp-exam-json-size-reasonable: ${pass} pass, ${fail} out-of-range`);
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log(`OK — all ${pass} exam JSON files have reasonable sizes`);
