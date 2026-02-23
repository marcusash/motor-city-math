// gp-tolerance-range.test.js — numeric tolerances are in reasonable range (0 < tol <= 0.5)
// Tolerance of 0 makes it impossible to match; tolerance > 0.5 is too permissive

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
const MIN_TOL = 0;
const MAX_TOL = 0.5;

let pass = 0;
let fail = 0;
const warnings = [];
const violations = [];

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  const questions = data.questions || [];
  for (const q of questions) {
    const inputs = q.inputs || [];
    for (const inp of inputs) {
      if (inp.type === 'number' && inp.tolerance !== undefined) {
        const tol = inp.tolerance;
        if (tol < 0 || tol > MAX_TOL) {
          fail++;
          violations.push(`${file} Q${q.id || q.number} "${inp.id}": tolerance=${tol} out of range [0, ${MAX_TOL}]`);
        } else if (tol === 0) {
          warnings.push(`${file} Q${q.id || q.number} "${inp.id}": tolerance=0 (exact match required)`);
          pass++;
        } else {
          pass++;
        }
      }
    }
  }
}

console.log(`gp-tolerance-range: ${pass} pass, ${fail} fail`);
if (warnings.length) {
  console.log(`WARNINGS (${warnings.length} exact-match tolerances):`);
  warnings.forEach(w => console.log('  ', w));
}
if (violations.length) {
  console.log('VIOLATIONS:');
  violations.forEach(v => console.log('  ', v));
  process.exit(1);
}
console.log('OK — all tolerances in acceptable range');
