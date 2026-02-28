/**
 * error-state-matrix.test.js
 * Static guardrails for key error/empty states on active pages.
 *
 * Run: node tests/f-validation/error-state-matrix.test.js
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..', '..');
const exam = fs.readFileSync(path.join(ROOT, 'exam.html'), 'utf-8');
const sharedScripts = fs.readFileSync(path.join(ROOT, 'shared', 'scripts.js'), 'utf-8');
const index = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf-8');

let total = 0, pass = 0, fail = 0;
function test(name, ok, detail = '') {
  total++;
  if (ok) {
    pass++;
    console.log(`  ✅ ${name}`);
  } else {
    fail++;
    console.log(`  ❌ ${name}${detail ? ` — ${detail}` : ''}`);
  }
}

console.log('\n🏀 error-state-matrix.test.js\n');

console.log('── exam.html error states ──');
test(
  'missing file param shows exam picker',
  exam.includes("if (!file)") && exam.includes('exam-picker')
);
test(
  'fetch failure shows explicit load error',
  exam.includes('showLoadError') && exam.includes('error-msg') && exam.includes("Can't reach this test")
);
test(
  'blank-field guard before grading exists',
  exam.includes('Fill in everything before grading.') && exam.includes('submitWarning')
);
test(
  'invalid expression parser safely falls through to NaN',
  sharedScripts.includes('invalid expression') && sharedScripts.includes('return NaN;')
);
test(
  'real exam low-score lock message exists',
  exam.includes('Score locked. Study the hints above, then hit the practice tests.')
);

console.log('\n── index.html error states ──');
test(
  'restore mode fetch failure has user-facing alert',
  index.includes("Could not load score file.")
);
test(
  'manual restore invalid file alert exists',
  index.includes('Invalid score file. Use the \"Send Scores to Dad\" export.')
);
test(
  'Dad mode upload parse failure alert exists',
  index.includes('Could not read score file.')
);
test(
  'Dad mode missing score payload alert exists',
  index.includes('File missing score data.')
);
test(
  'fallback to empty mcm_scores object exists',
  index.includes("localStorage.getItem('mcm_scores') || '{}'")
);

console.log('\n── Summary ──');
console.log(`  Total: ${total}`);
console.log(`  ✅ Passed: ${pass}`);
console.log(`  ❌ Failed: ${fail}`);

if (fail > 0) process.exit(1);
