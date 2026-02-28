// gp-scripts-exist.test.js — all scripts referenced in package.json scripts exist
// A broken script reference causes npm run to fail silently

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const pkg = JSON.parse(fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8'));
const scripts = pkg.scripts || {};

// Extract node script file paths from script values
const scriptFilePattern = /node\s+([\w./\-]+\.(?:js|cjs|mjs))/g;

let pass = 0;
let fail = 0;
const violations = [];

for (const [name, cmd] of Object.entries(scripts)) {
  let match;
  const regex = new RegExp(scriptFilePattern.source, 'g');
  while ((match = regex.exec(cmd)) !== null) {
    const scriptPath = match[1];
    const fullPath = path.join(ROOT, scriptPath);
    if (fs.existsSync(fullPath)) {
      pass++;
    } else {
      fail++;
      violations.push(`npm run ${name}: references missing file "${scriptPath}"`);
    }
  }
}

console.log(`gp-scripts-exist: ${pass} pass, ${fail} fail`);
if (violations.length) {
  console.log('VIOLATIONS:');
  violations.forEach(v => console.log('  ', v));
  process.exit(1);
}
console.log(`OK — all ${pass} script files referenced in package.json exist`);
