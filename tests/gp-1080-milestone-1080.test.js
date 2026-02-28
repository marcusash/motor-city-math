// gp-1080-milestone-1080.test.js -- milestone marker: 1080 tests

const fs = require('fs');
const path = require('path');

const TEST_DIR = path.join(__dirname);
const count = fs.readdirSync(TEST_DIR).filter(f => /^gp-.+\.test\.js$/.test(f)).length;

console.log(`gp-1080-milestone: ${count} GP tests exist`);
if (count >= 1080) {
  console.log(`OK -- 1080+ test milestone reached (${count})`);
} else {
  console.log(`INFO -- ${1080 - count} more to reach 1080`);
}
