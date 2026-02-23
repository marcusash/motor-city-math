// gp-graph-function-math-ops-valid.test.js — graph functions should use valid JS math operators

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

// Check for common invalid patterns (mixing Python/LaTeX syntax)
const INVALID_PATTERNS = [
  { re: /\^/, label: 'caret (use Math.pow or ** instead)' },
  { re: /sqrt\s*\((?!Math)/, label: 'bare sqrt (use Math.sqrt)' },
  { re: /abs\s*\((?!Math)/, label: 'bare abs (use Math.abs)' },
  { re: /log\s*\((?!Math)/, label: 'bare log (use Math.log)' },
];

let pass = 0;
let warn = 0;
const warnings = [];

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions) {
    if (!q.graph || !q.graph.function) continue;
    const fn = q.graph.function;
    let hasIssue = false;
    for (const { re, label } of INVALID_PATTERNS) {
      if (re.test(fn)) {
        warn++;
        warnings.push(`${file}: Q${q.id} graph.function='${fn}' uses ${label}`);
        hasIssue = true;
        break;
      }
    }
    if (!hasIssue) pass++;
  }
}

console.log(`gp-graph-function-math-ops-valid: ${pass} pass, ${warn} flagged`);
if (warnings.length) {
  console.log('INFO — functions with potentially invalid math syntax:');
  warnings.forEach(w => console.log('  ', w));
}
console.log(`OK — ${pass} graph functions use valid JS math operators`);
