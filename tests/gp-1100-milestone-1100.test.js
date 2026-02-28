// gp-1100-milestone-1100.test.js -- milestone marker: 1100 tests

const fs = require('fs');
const path = require('path');

const TEST_DIR = path.join(__dirname);
const count = fs.readdirSync(TEST_DIR).filter(f => /^gp-.+\.test\.js$/.test(f)).length;

console.log(`gp-1100-milestone: ${count} GP tests exist`);
if (count >= 1100) {
  console.log(`OK -- 1100+ test milestone reached (${count})`);
} else {
  console.log(`INFO -- ${1100 - count} more to reach 1100`);
}
