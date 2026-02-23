// gp-1050-milestone-1050.test.js — milestone marker: 1050 tests

const fs = require('fs');
const path = require('path');

const TEST_DIR = path.join(__dirname);
const count = fs.readdirSync(TEST_DIR).filter(f => /^gp-.+\.test\.js$/.test(f)).length;

console.log(`gp-1050-milestone: ${count} GP tests exist`);
if (count >= 1050) {
  console.log(`OK — 1050+ test milestone reached (${count})`);
} else {
  console.log(`INFO — ${1050 - count} more to reach 1050`);
}
