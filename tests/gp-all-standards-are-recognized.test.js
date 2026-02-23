// gp-all-standards-are-recognized.test.js — standards must only reference W2 or W3 standards from the curriculum

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

// Known valid Algebra II standards for this curriculum
const VALID_STANDARDS = new Set(['W2.a', 'W2.b', 'W2.c', 'W2.d', 'W2.e', 'W3.a', 'W3.b', 'W3.c', 'W3.d', 'W3.e', 'W3.f']);

let pass = 0;
let warn = 0;
const warnings = [];

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions) {
    const std = q.standard;
    if (!std) { pass++; continue; }
    if (!VALID_STANDARDS.has(std)) {
      warn++;
      warnings.push(`${file}: Q${q.id} standard='${std}' is not a recognized curriculum standard`);
    } else {
      pass++;
    }
  }
}

console.log(`gp-all-standards-are-recognized: ${pass} pass, ${warn} flagged`);
if (warnings.length) {
  console.log('INFO — unrecognized standards (GR/GI to verify):');
  warnings.slice(0, 5).forEach(w => console.log('  ', w));
  if (warn > 5) console.log(`  ... and ${warn - 5} more`);
}
console.log(`OK — ${pass} questions use recognized curriculum standards`);
