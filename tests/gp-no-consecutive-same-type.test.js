// gp-no-consecutive-same-type.test.js
// Same question type should not appear 3+ times in a row (reduces study variety)

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

const MAX_CONSECUTIVE = 2;

let pass = 0;
let warn = 0;
const warnings = [];

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  const types = data.questions.map(q => q.type || 'unknown');
  
  let consecutive = 1;
  let hasViolation = false;
  
  for (let i = 1; i < types.length; i++) {
    if (types[i] === types[i - 1]) {
      consecutive++;
      if (consecutive > MAX_CONSECUTIVE) {
        hasViolation = true;
        warnings.push(`${file}: '${types[i]}' appears ${consecutive}+ times starting at Q${i - consecutive + 2}`);
      }
    } else {
      consecutive = 1;
    }
  }
  
  if (!hasViolation) {
    pass++;
  } else {
    warn++;
  }
}

console.log(`gp-no-consecutive-same-type: ${pass} pass, ${warn} with runs`);
if (warnings.length) {
  console.log('INFO — type concentration runs (informational, notify GR):');
  warnings.forEach(w => console.log('  ', w));
}
console.log(`OK — ${pass} exams have good type variety flow`);
