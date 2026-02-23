/**
 * timer-contract.test.js
 * GF predicted gap #1: Timer count-down contract.
 *
 * Extracts and tests the timer's pure logic from shared/scripts.js:
 * - formatTime() formats M:SS correctly
 * - tick() decrements remaining (not increments)
 * - timer reaches 0 and fires onTimeUp
 * - state class thresholds (urgent, warning, normal)
 * - aria-label says "Time remaining" (not "elapsed")
 */

'use strict';

const fs = require('fs');
const path = require('path');

const SCRIPTS_PATH = path.resolve(__dirname, '..', '..', 'shared', 'scripts.js');

let passed = 0;
let failed = 0;

function pass(msg) {
  console.log(`  \u2713 ${msg}`);
  passed++;
}

function fail(msg) {
  console.error(`  \u2717 FAIL: ${msg}`);
  failed++;
}

const scriptsJs = fs.readFileSync(SCRIPTS_PATH, 'utf8');

console.log('\nTimer Contract Tests\n');

// === 1. Source contract (static checks on scripts.js) ===
console.log('  1. Timer source contracts:');

// Timer counts DOWN: remaining-- not remaining++
const hasDecrement = scriptsJs.includes('remaining--');
const hasIncrement = !scriptsJs.includes('remaining++');
hasDecrement ? pass('timer uses remaining-- (counts down)') : fail('timer uses remaining-- not found');
hasIncrement ? pass('timer does NOT use remaining++ (no count-up)') : fail('timer uses remaining++ — counts UP not DOWN');

// Timer stops at 0
const stopsAtZero = scriptsJs.includes('remaining <= 0');
stopsAtZero ? pass('timer stops when remaining <= 0') : fail('timer does not check remaining <= 0');

// Timer fires onTimeUp
const firesCallback = scriptsJs.includes('opts.onTimeUp');
firesCallback ? pass('timer fires opts.onTimeUp callback') : fail('timer missing onTimeUp callback');

// aria-label is "Time remaining" not "Time elapsed"
const hasRemainingLabel = scriptsJs.includes('"Time remaining"') || scriptsJs.includes("'Time remaining'");
hasRemainingLabel ? pass('aria-label says "Time remaining" (ADHD spec)') : fail('aria-label missing "Time remaining"');

// Timer displays "TIME" at 0
const showsTime = scriptsJs.includes("'TIME'") || scriptsJs.includes('"TIME"');
showsTime ? pass('timer shows "TIME" at expiration') : fail('timer does not show "TIME" at expiration');

// === 2. formatTime() pure function extraction and unit test ===
console.log('\n  2. formatTime() unit tests:');

// Extract formatTime from the script
// Pattern: function formatTime(s) { var m = Math.floor(s/60); var sec = s%60; return m + ':' + ... }
const formatTimeMatch = scriptsJs.match(/function formatTime\(s\)\s*\{([^}]+)\}/);
if (!formatTimeMatch) {
  fail('formatTime() function not found in scripts.js');
} else {
  pass('formatTime() extracted from scripts.js');

  // Execute extracted function
  let formatTime;
  try {
    // eslint-disable-next-line no-new-func
    formatTime = new Function('s', formatTimeMatch[1].replace('return', 'return '));
  } catch (e) {
    fail(`formatTime() could not be evaluated: ${e.message}`);
  }

  if (formatTime) {
    const cases = [
      { s: 0, expected: '0:00' },
      { s: 1, expected: '0:01' },
      { s: 9, expected: '0:09' },
      { s: 10, expected: '0:10' },
      { s: 59, expected: '0:59' },
      { s: 60, expected: '1:00' },
      { s: 61, expected: '1:01' },
      { s: 600, expected: '10:00' },
      { s: 2700, expected: '45:00' },
      { s: 3599, expected: '59:59' },
      { s: 3600, expected: '60:00' },
    ];

    for (const { s, expected } of cases) {
      const got = formatTime(s);
      if (got === expected) {
        pass(`formatTime(${s}) === "${expected}"`);
      } else {
        fail(`formatTime(${s}): expected "${expected}", got "${got}"`);
      }
    }
  }
}

// === 3. State class threshold contract ===
console.log('\n  3. State class thresholds:');

// Per .timer-spec.md and scripts.js tick():
// remaining <= 60s (1 min) → 'timer urgent' + pulse every 15s
// remaining <= 300s (5 min) → 'timer urgent'
// remaining <= 600s (10 min) → 'timer warning'
// else → 'timer'

const has1minUrgent = scriptsJs.includes('mins <= 1') || scriptsJs.includes('remaining <= 60');
const has5minUrgent = scriptsJs.includes('mins <= 5') || scriptsJs.includes('remaining <= 300');
const has10minWarning = scriptsJs.includes('mins <= 10') || scriptsJs.includes('remaining <= 600');

has1minUrgent ? pass('1-min threshold triggers urgent class') : fail('1-min urgent threshold not found');
has5minUrgent ? pass('5-min threshold triggers urgent class') : fail('5-min urgent threshold not found');
has10minWarning ? pass('10-min threshold triggers warning class') : fail('10-min warning threshold not found');

// === 4. Pulse behavior ===
console.log('\n  4. Pulse behavior:');

const hasPulseAt15s = scriptsJs.includes('remaining % 15 === 0');
const hasPulse = scriptsJs.includes("classList.add('pulse')");
hasPulseAt15s ? pass('pulse fires every 15s in final minute') : fail('15s pulse trigger not found');
hasPulse ? pass("timer.classList.add('pulse') for urgency") : fail("timer classList.add('pulse') not found");

// === 5. ADHD compliance (timer spec) ===
console.log('\n  5. ADHD compliance:');

// Motivational toasts (not just raw numbers)
const hasMotivationalToast = scriptsJs.includes('Stay locked in') || scriptsJs.includes('10 min');
hasMotivationalToast ? pass('timer fires motivational toast at 10 min') : fail('motivational toast at 10 min not found');

// Timer shows REMAINING not elapsed (already checked via aria-label)
// Double-check: no "elapsed" language
const noElapsedLanguage = !scriptsJs.includes('Time elapsed') && !scriptsJs.includes('time elapsed');
noElapsedLanguage ? pass('no "elapsed" language in timer (shows remaining)') : fail('timer uses "elapsed" language — ADHD violation');

console.log(`\n${'='.repeat(50)}`);
console.log(`${passed + failed} checks: ${passed} passed, ${failed} failed`);
if (failed > 0) {
  console.error('\u2718 FAIL');
  process.exit(1);
} else {
  console.log('\u2714 PASS');
}
