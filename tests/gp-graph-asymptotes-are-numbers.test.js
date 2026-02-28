// gp-graph-asymptotes-are-numbers.test.js — graph asymptotes (when present) should be arrays of numbers

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

let pass = 0;
let fail = 0;
let hasAsymptotes = 0;
const failures = [];

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions) {
    if (!q.graph) continue;
    if (!q.graph.asymptotes) { pass++; continue; }
    hasAsymptotes++;
    const asym = q.graph.asymptotes;
    // Two valid schemas:
    // Old (RP1-5): object with {vertical:[n], horizontal:[n]}
    // New (RP6-11): array of numbers
    if (Array.isArray(asym)) {
      const badValues = asym.filter(a => typeof a !== 'number');
      if (badValues.length > 0) {
        fail++;
        failures.push(`${file}: Q${q.id} asymptotes array has non-number: ${JSON.stringify(asym)}`);
      } else { pass++; console.log(`  Q${q.id}: asymptotes (array)=${JSON.stringify(asym)}`); }
    } else if (typeof asym === 'object' && asym !== null) {
      const vValid = !asym.vertical || (Array.isArray(asym.vertical) && asym.vertical.every(n => typeof n === 'number'));
      const hValid = !asym.horizontal || (Array.isArray(asym.horizontal) && asym.horizontal.every(n => typeof n === 'number'));
      if (!vValid || !hValid) { fail++; failures.push(`${file}: Q${q.id} asymptotes object invalid`); }
      else { pass++; console.log(`  Q${q.id}: asymptotes (object)=${JSON.stringify(asym)}`); }
    } else { fail++; failures.push(`${file}: Q${q.id} asymptotes unexpected type ${typeof asym}`); }
  }
}

console.log(`gp-graph-asymptotes-are-numbers: ${pass} pass, ${fail} invalid`);
console.log(`  ${hasAsymptotes} graphs have asymptotes field`);
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log(`OK — graph asymptotes audit complete`);
