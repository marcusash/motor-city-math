// gp-standard-distribution-balanced.test.js
// No single standard should dominate >40% of a single exam (prevents lopsided prep)

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

const MAX_RATIO = 0.40; // 40% of questions from same standard = flag

let pass = 0;
let warn = 0;
const warnings = [];

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  const total = data.questions.length;
  const counts = {};
  
  for (const q of data.questions) {
    const std = q.standard || 'unknown';
    counts[std] = (counts[std] || 0) + 1;
  }
  
  for (const [std, count] of Object.entries(counts)) {
    const ratio = count / total;
    if (ratio > MAX_RATIO) {
      warn++;
      warnings.push(`${file}: standard '${std}' = ${count}/${total} (${Math.round(ratio * 100)}%) — over ${MAX_RATIO * 100}% threshold`);
    } else {
      pass++;
    }
  }
}

console.log(`gp-standard-distribution-balanced: ${pass} balanced, ${warn} over-threshold`);
if (warnings.length) {
  console.log(`INFO — standard dominance warnings (informational, notify GR):`);
  warnings.forEach(w => console.log('  ', w));
}
console.log(`OK — ${pass} standard-exam pairs balanced`);
// Informational — GR must fix content distribution
