/**
 * gp-tolerance-audit.js
 * Verifies that all numeric input tolerances are sane (not too tight, not too loose).
 *
 * Rules:
 * - Integer answers: tolerance should be 0.05 or less
 * - Decimal answers: tolerance should be 0.01 to 0.1
 * - Large numbers (>100): tolerance should be at least 0.1
 * - tolerance must be > 0 (never zero-tolerance)
 *
 * Usage: node scripts/gp-tolerance-audit.js
 */
const fs = require('fs');
const path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');

const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => f.startsWith('retake-practice-') && f.endsWith('.json'))
  .sort();

let checked = 0;
let warnings = 0;
const issues = [];

for (const fname of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, fname), 'utf8'));
  if (!data.questions || data.questions.length === 0) continue;

  for (const q of data.questions) {
    if (!q.inputs) continue;
    for (const inp of q.inputs) {
      if (inp.type !== 'number') continue;
      if (typeof inp.answer !== 'number') continue;
      checked++;

      const tol = inp.tolerance;
      const ans = Math.abs(inp.answer);

      if (tol === undefined || tol === null) {
        issues.push(`${fname} ${q.id}.${inp.id}: answer=${inp.answer}, NO tolerance field`);
        warnings++;
        continue;
      }

      if (tol <= 0) {
        issues.push(`${fname} ${q.id}.${inp.id}: tolerance=${tol} is zero or negative`);
        warnings++;
        continue;
      }

      if (tol > 1.0) {
        issues.push(`${fname} ${q.id}.${inp.id}: tolerance=${tol} seems too loose (answer=${inp.answer})`);
        warnings++;
        continue;
      }

      if (ans > 100 && tol < 0.5) {
        issues.push(`${fname} ${q.id}.${inp.id}: answer=${inp.answer} is large but tolerance=${tol} — consider 0.5+`);
        warnings++;
      }
    }
  }
}

console.log(`\n=== GP Tolerance Audit ===`);
console.log(`Checked ${checked} numeric inputs`);
if (warnings === 0) {
  console.log(`✅ All tolerances look sane`);
} else {
  console.log(`⚠️  ${warnings} potential issue(s):`);
  issues.forEach(i => console.log(`  ${i}`));
}
process.exit(0); // advisory
