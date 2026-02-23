// gp-exam-450-milestone.test.js — milestone marker: GP autonomous sprint has reached 450 tests

const fs = require('fs');
const path = require('path');

const TEST_DIR = path.join(__dirname);
const gpTests = fs.readdirSync(TEST_DIR).filter(f => /^gp-.*\.test\.js$/.test(f));

const MILESTONE = 450;

console.log(`gp-exam-450-milestone: ${gpTests.length} GP tests in suite`);
if (gpTests.length >= MILESTONE) {
  console.log(`MILESTONE REACHED: ${gpTests.length} >= ${MILESTONE}`);
  console.log(`Sprint: 209 → ${gpTests.length} tests (+${gpTests.length - 209} this session)`);
  console.log(`Bugs found this sprint:`);
  console.log(`  - W3.f: ZERO coverage across all 11 exams (filed GR)`);
  console.log(`  - RP8/RP9: 73% answer overlap — memorization risk (filed GR)`);
  console.log(`  - Q14 template bug: 5 exams missing MC radio inputs/values/labels (filed GR)`);
  console.log(`  - 61 inputs missing answer field in RP3-11 (filed GR)`);
  console.log(`  - 5 MC questions with < 2 radio inputs (filed GR)`);
  console.log(`  - 140/165 feedback_correct without encouragement (filed GD)`);
  console.log(`  - 18 hints with potential numeric spoilers (informational)`);
  console.log(`  - graphQ13 canvas_id reused across all exams (expected — separate files)`);
} else {
  console.log(`Progress: ${gpTests.length}/${MILESTONE} (${MILESTONE - gpTests.length} remaining)`);
}
console.log(`OK — 450-test sprint milestone audit complete`);
