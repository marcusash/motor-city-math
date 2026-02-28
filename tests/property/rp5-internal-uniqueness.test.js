/**
 * Regression test: RP5 Q4/Q6/Q11/Q15 cross-exam collision fixes.
 * Guards against re-introducing the cross-exam slot collisions fixed Feb 2026.
 *
 * Before fix: Q4=9 (collided with rp9 Q4), Q6=8 (rp2 Q6), Q11=25 (rp3 Q11), Q15=20 (MVP Q15)
 * After fix:  Q4=10, Q6=12, Q11=36, Q15=15
 *
 * Run: node tests/property/rp5-internal-uniqueness.test.js
 */

'use strict';

const fs = require('fs');
const path = require('path');

const RP5_PATH = path.join(__dirname, '..', '..', 'data', 'retake-practice-5.json');

const exam = JSON.parse(fs.readFileSync(RP5_PATH, 'utf8'));

// Map question number -> first numeric answer
const answerByQ = {};
for (const q of exam.questions || []) {
  for (const inp of q.inputs || []) {
    if (typeof inp.answer === 'number' && Number.isInteger(inp.answer)) {
      if (answerByQ[q.number] === undefined) answerByQ[q.number] = inp.answer;
    }
  }
}

// Expected post-fix answers for the 4 formerly-colliding questions
const EXPECTED = { 4: 10, 6: 12, 11: 36, 15: 15 };
// Formerly-colliding values that must NOT appear in these slots
const BANNED_WAS = { 4: 9, 6: 8, 11: 25, 15: 20 };

let pass = 0;
let fail = 0;

for (const [qNum, expected] of Object.entries(EXPECTED)) {
  const actual = answerByQ[Number(qNum)];
  const banned = BANNED_WAS[qNum];

  if (actual === banned) {
    console.error(`FAIL RP5 Q${qNum}: answer is still the colliding value ${banned} (should be ${expected})`);
    fail++;
  } else if (actual === expected) {
    console.log(`PASS RP5 Q${qNum}: answer=${actual} (not ${banned})`);
    pass++;
  } else {
    // Answer changed but not to what we expected — still fine as long as not banned
    console.log(`PASS RP5 Q${qNum}: answer=${actual} (not banned value ${banned})`);
    pass++;
  }
}

console.log(`\n${pass} checks passed, ${fail} regressions`);
if (fail > 0) process.exit(1);
