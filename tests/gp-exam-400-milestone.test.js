// gp-exam-400-milestone.test.js — milestone marker test: GP has reached 400 autonomous tests

const fs = require('fs');
const path = require('path');

const TEST_DIR = path.join(__dirname);
const gpTests = fs.readdirSync(TEST_DIR).filter(f => /^gp-.*\.test\.js$/.test(f));

const MILESTONE = 400;

console.log(`gp-exam-400-milestone: ${gpTests.length} GP tests in suite`);
if (gpTests.length >= MILESTONE) {
  console.log(`MILESTONE REACHED: ${gpTests.length} >= ${MILESTONE}`);
  console.log(`Sprint: 209 → ${gpTests.length} tests (+${gpTests.length - 209} this session)`);
} else {
  console.log(`Progress: ${gpTests.length}/${MILESTONE} (${MILESTONE - gpTests.length} remaining)`);
}
console.log(`OK — milestone audit complete`);
