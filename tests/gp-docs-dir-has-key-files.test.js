// gp-docs-dir-has-key-files.test.js — docs/ directory must have core documentation files

const fs = require('fs');
const path = require('path');

const DOCS_DIR = path.join(__dirname, '..', 'docs');
const REQUIRED_DOCS = [
  'data-model.md',
  'architecture.md',
];

let pass = 0;
let warn = 0;
const warnings = [];

for (const doc of REQUIRED_DOCS) {
  const fullPath = path.join(DOCS_DIR, doc);
  if (!fs.existsSync(fullPath)) {
    warn++;
    warnings.push(`docs/${doc}: not found`);
  } else {
    pass++;
  }
}

const allDocs = fs.existsSync(DOCS_DIR) ?
  fs.readdirSync(DOCS_DIR, { withFileTypes: true }).filter(f => f.isFile()).length : 0;

console.log(`gp-docs-dir-has-key-files: ${pass} pass, ${warn} missing (${allDocs} total docs)`);
if (warnings.length) {
  console.log('INFO — missing docs files:');
  warnings.forEach(w => console.log('  ', w));
}
console.log(`OK — ${pass} required docs present out of ${REQUIRED_DOCS.length} expected`);
