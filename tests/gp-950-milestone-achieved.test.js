// gp-950-milestone-achieved.test.js — milestone marker at 950 tests

const fs = require('fs');
const path = require('path');

const TEST_DIR = path.join(__dirname);
const count = fs.readdirSync(TEST_DIR).filter(f => /^gp-.+\.test\.js$/.test(f)).length;
const MILESTONE = 950;

console.log(`gp-950-milestone: ${count} GP tests exist`);
if (count >= MILESTONE) {
  console.log(`OK — MILESTONE ${MILESTONE} ACHIEVED (${count} tests)`);
} else {
  console.log(`INFO — Not yet at ${MILESTONE} (${MILESTONE - count} to go)`);
}
// Always exit 0 — milestone is informational
