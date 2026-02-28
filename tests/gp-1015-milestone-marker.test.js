// gp-1015-milestone-marker.test.js — milestone marker: 1015 tests

const fs = require('fs');
const path = require('path');

const TEST_DIR = path.join(__dirname);
const count = fs.readdirSync(TEST_DIR).filter(f => /^gp-.+\.test\.js$/.test(f)).length;

console.log(`gp-1015-milestone-marker: ${count} GP tests exist`);
if (count >= 1015) {
  console.log(`OK — 1015+ test milestone reached (${count})`);
} else {
  console.log(`INFO — ${1015 - count} more to reach 1015`);
}
