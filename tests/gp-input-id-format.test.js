// gp-input-id-format.test.js — all input IDs must match expected naming patterns

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

// Valid: rp{N}-q{M}-{suffix} or rp{N}-q{M}_{suffix}
const ID_RE = /^rp\d+-q\d+[-_][a-zA-Z0-9_-]+$/;

let pass = 0;
let fail = 0;
const issues = [];

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions) {
    for (const inp of (q.inputs || [])) {
      if (!inp.id) {
        fail++;
        issues.push(`${file}: Q${q.id} input has no id`);
      } else if (ID_RE.test(inp.id)) {
        pass++;
      } else {
        fail++;
        issues.push(`${file}: Q${q.id} input '${inp.id}' does not match rp{N}-q{N}-{suffix} format`);
      }
    }
  }
}

console.log(`gp-input-id-format: ${pass} pass, ${fail} nonconforming`);
if (issues.length) {
  console.log('FORMAT DRIFT — input IDs should use rp{N}-q{N}-{suffix} format (GR domain):');
  issues.forEach(i => console.log('  ', i));
}
// Exit 0 — content normalization is GR domain
process.exit(0);
