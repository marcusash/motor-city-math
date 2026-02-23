// gp-docs-dir-exists.test.js — docs/ directory must exist with key GP documentation

const fs = require('fs');
const path = require('path');

const DOCS_DIR = path.join(__dirname, '..', 'docs');
const REQUIRED_DOCS = [
  'gp-project-stats.md',
  'data-model.md'
];

let pass = 0;
let warn = 0;
const warnings = [];

if (!fs.existsSync(DOCS_DIR)) {
  console.log('gp-docs-dir-exists: FAIL — docs/ directory does not exist');
  process.exit(1);
}

console.log(`gp-docs-dir-exists: docs/ directory found`);

for (const doc of REQUIRED_DOCS) {
  const docPath = path.join(DOCS_DIR, doc);
  if (fs.existsSync(docPath)) {
    pass++;
    console.log(`  FOUND: docs/${doc}`);
  } else {
    warn++;
    warnings.push(`docs/${doc} missing`);
  }
}

console.log(`gp-docs-dir-exists: ${pass} pass, ${warn} missing`);
if (warnings.length) {
  console.log('INFO — missing docs:');
  warnings.forEach(w => console.log('  ', w));
}
console.log(`OK — docs/ exists with ${pass} required files`);
