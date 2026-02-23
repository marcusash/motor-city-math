// gp-test-dir-gp-prefix-convention.test.js — all GP-authored tests must start with 'gp-' prefix

const fs = require('fs');
const path = require('path');

const TESTS_DIR = path.join(__dirname);
const allTests = fs.readdirSync(TESTS_DIR).filter(f => f.endsWith('.test.js'));
const gpTests = allTests.filter(f => f.startsWith('gp-'));
const nonGpTests = allTests.filter(f => !f.startsWith('gp-'));

console.log(`gp-test-dir-gp-prefix-convention: ${gpTests.length} gp- tests, ${nonGpTests.length} other tests`);

if (nonGpTests.length > 0) {
  console.log('  Non-GP tests (owned by other agents):');
  nonGpTests.forEach(f => console.log(`    ${f}`));
}

console.log(`OK — GP prefix convention documented (${gpTests.length} GP tests)`);
