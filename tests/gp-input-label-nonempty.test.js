// gp-input-label-nonempty.test.js — text/number inputs should have non-empty labels
// Radio inputs can skip labels (question_html serves as label per test notes)

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

const REQUIRES_LABEL = new Set(['text', 'number']);

let pass = 0;
let skip = 0;
let fail = 0;
const issues = [];

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions) {
    for (const inp of (q.inputs || [])) {
      if (!REQUIRES_LABEL.has(inp.type)) { skip++; continue; }
      
      const label = (inp.label || '').trim();
      if (label.length === 0) {
        fail++;
        issues.push(`${file}: Q${q.id} '${inp.id}' (${inp.type}) has empty label`);
      } else {
        pass++;
      }
    }
  }
}

console.log(`gp-input-label-nonempty: ${pass} pass, ${fail} empty labels, ${skip} non-labeled types skipped`);
if (issues.length) {
  console.log('EMPTY LABEL VIOLATIONS (affects Kai UX — must fix):');
  issues.slice(0, 8).forEach(i => console.log('  ', i));
  if (issues.length > 8) console.log(`  ... and ${issues.length - 8} more`);
  process.exit(1);
}
console.log(`OK — all ${pass} text/number inputs have labels`);
