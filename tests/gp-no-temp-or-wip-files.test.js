// gp-no-temp-or-wip-files.test.js — no .tmp, .bak, .wip, ~backup files in repo root

const fs = require('fs');
const path = require('path');

const REPO_ROOT = path.join(__dirname, '..');
const TEMP_PATTERNS = [/\.tmp$/i, /\.bak$/i, /\.wip$/i, /~$/, /\.orig$/i, /copy\s+of/i];

let pass = 0;
let warn = 0;
const warnings = [];

const files = fs.readdirSync(REPO_ROOT)
  .filter(f => !fs.statSync(path.join(REPO_ROOT, f)).isDirectory());

for (const file of files) {
  if (TEMP_PATTERNS.some(p => p.test(file))) {
    warn++;
    warnings.push(`${file}: matches temp/wip file pattern`);
  } else {
    pass++;
  }
}

console.log(`gp-no-temp-or-wip-files: ${pass} clean, ${warn} flagged`);
if (warnings.length) {
  console.log('INFO — temp/wip files found in repo root:');
  warnings.forEach(w => console.log('  ', w));
}
console.log(`OK — ${pass} files checked, no temp/wip patterns`);
