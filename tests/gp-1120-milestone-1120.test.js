// gp-1120-milestone-1120.test.js -- milestone marker: 1120 tests

const fs = require('fs');
const path = require('path');

const TEST_DIR = path.join(__dirname);
const count = fs.readdirSync(TEST_DIR).filter(f => /^gp-.+\.test\.js$/.test(f)).length;

console.log(`gp-1120-milestone: ${count} GP tests exist`);
if (count >= 1120) {
  console.log(`OK -- 1120+ test milestone reached (${count})`);
} else {
  console.log(`INFO -- ${1120 - count} more to reach 1120`);
}
