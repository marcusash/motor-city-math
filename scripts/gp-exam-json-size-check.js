// gp-exam-json-size-check.js — ensure no exam JSON is unexpectedly large or small
// Unexpected size could indicate corrupt data or accidental duplication

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

const MIN_BYTES = 10_000;   // 10KB minimum — a valid exam must be substantial
const MAX_BYTES = 200_000;  // 200KB maximum — guard against accidental duplication

let pass = 0;
let fail = 0;
const issues = [];

for (const file of RP_FILES) {
  const filePath = path.join(DATA_DIR, file);
  const stats = fs.statSync(filePath);
  const bytes = stats.size;
  const kb = (bytes / 1024).toFixed(1);
  
  if (bytes < MIN_BYTES) {
    fail++;
    issues.push(`${file}: ${kb}KB — suspiciously small (min: ${MIN_BYTES / 1000}KB)`);
  } else if (bytes > MAX_BYTES) {
    fail++;
    issues.push(`${file}: ${kb}KB — suspiciously large (max: ${MAX_BYTES / 1000}KB)`);
  } else {
    pass++;
    console.log(`  ${file}: ${kb}KB ✅`);
  }
}

console.log(`\ngp-exam-json-size-check: ${pass} pass, ${fail} fail`);
if (issues.length) {
  issues.forEach(i => console.log('  ⚠️  ', i));
  process.exit(1);
}
console.log(`OK — all ${pass} exam files within expected size range`);
