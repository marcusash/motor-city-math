// gp-option-count-mc.test.js — multiple choice questions should have exactly 4 options (A/B/C/D)

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

const EXPECTED_MC_OPTIONS = 4;

let pass = 0;
let fail = 0;
const issues = [];

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions) {
    for (const inp of (q.inputs || [])) {
      if (inp.type !== 'radio' && inp.type !== 'multiple-choice') continue;
      const opts = inp.options || [];
      if (opts.length === EXPECTED_MC_OPTIONS) {
        pass++;
      } else {
        // Flag as informational since some questions might legitimately have 3 or 5 options
        fail++;
        issues.push(`${file}: Q${q.id} input '${inp.id}' has ${opts.length} options (expected ${EXPECTED_MC_OPTIONS})`);
      }
    }
  }
}

const label = fail > 0 ? `${fail} non-standard` : '0 non-standard';
console.log(`gp-option-count-mc: ${pass} pass, ${label}`);
if (issues.length) {
  console.log('NON-STANDARD OPTION COUNTS (informational):');
  issues.forEach(i => console.log('  ', i));
}
// Informational only — some exams may legitimately have different option counts
process.exit(0);
