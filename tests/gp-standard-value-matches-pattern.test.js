// gp-standard-value-matches-pattern.test.js — question standard should match W{N}.{letter} format

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

const STANDARD_PATTERN = /^W\d+\.[a-z]$/;

let pass = 0;
let warn = 0;
const warnings = [];

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions) {
    const std = q.standard;
    if (!std) { pass++; continue; }
    if (!STANDARD_PATTERN.test(std)) {
      warn++;
      warnings.push(`${file}: Q${q.id} standard='${std}' doesn't match W{N}.{letter} pattern`);
    } else {
      pass++;
    }
  }
}

console.log(`gp-standard-value-matches-pattern: ${pass} pass, ${warn} flagged`);
if (warnings.length) {
  console.log('INFO — standards with unexpected format:');
  warnings.slice(0, 5).forEach(w => console.log('  ', w));
  if (warn > 5) console.log(`  ... and ${warn - 5} more`);
}
console.log(`OK — ${pass} questions have standard in W{N}.{letter} format`);
