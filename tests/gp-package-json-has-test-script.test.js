// gp-package-json-has-test-script.test.js — package.json must have a test script for CI

const fs = require('fs');
const path = require('path');

const pkgPath = path.join(__dirname, '..', 'package.json');

let pass = 0;
let fail = 0;

try {
  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
  const scripts = pkg.scripts || {};
  
  const requiredScripts = ['test', 'ci-gate'];
  for (const s of requiredScripts) {
    if (scripts[s]) {
      pass++;
      console.log(`  scripts.${s}: "${scripts[s]}"`);
    } else {
      fail++;
      console.log(`  FAIL: scripts.${s} missing from package.json`);
    }
  }
} catch (e) {
  fail++;
  console.log(`  FAIL: could not read package.json: ${e.message}`);
}

console.log(`gp-package-json-has-test-script: ${pass} pass, ${fail} fail`);
if (fail > 0) {
  process.exit(1);
}
console.log(`OK — package.json has required scripts`);
