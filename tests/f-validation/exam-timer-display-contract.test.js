// Timer display contract test
// Verifies formatTime() format, countdown direction, 0:00 terminal state, aria alerts

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} exam-timer-display-contract.test.js\n');

const src = fs.readFileSync(path.join(__dirname, '../../shared/scripts.js'), 'utf-8');

var timerFn = src.substring(src.indexOf('function initTimer('), src.length);
var formatFn = timerFn.substring(timerFn.indexOf('function formatTime('), timerFn.indexOf('function formatTime(') + 300);
var tickFn = timerFn.substring(timerFn.indexOf('function tick()'), timerFn.indexOf('function tick()') + 600);

console.log('\u2500\u2500 formatTime() contract \u2500\u2500');

// 1. formatTime returns M:SS format (not MM:SS or seconds-only)
test('formatTime uses M:SS format (not bare seconds)', formatFn.includes("':'" ) && formatFn.includes("'0'"));

// 2. Single-digit seconds padded with leading zero
test('Seconds padded with leading zero (< 10)', formatFn.includes('< 10') && formatFn.includes("'0'"));

// 3. 0:00 returned for negative or non-finite (guard)
test("formatTime returns '0:00' for invalid/negative input", formatFn.includes("'0:00'"));

// 4. Guard condition: !isFinite or s < 0
test('formatTime guards against NaN/Infinity/negative', formatFn.includes('isFinite') || formatFn.includes('< 0'));

console.log('\n\u2500\u2500 Countdown direction \u2500\u2500');

// 5. Timer counts DOWN (remaining--)
test('Timer decrements remaining (countdown, not countup)', tickFn.includes('remaining--'));

// 6. remaining NOT incremented (not a count-up timer)
test('Timer does not increment remaining (not a stopwatch)', !tickFn.includes('remaining++'));

// 7. Displays 0:00 when time expires
test("Timer displays '0:00' at expiry", tickFn.includes("'0:00'"));

// 8. onTimeUp callback called when timer expires
test('onTimeUp callback called on expiry', tickFn.includes('onTimeUp'));

console.log('\n\u2500\u2500 Accessibility \u2500\u2500');

// 9. aria-live on timer (screen reader updates)
test('Timer region uses aria-live for screen reader updates', timerFn.includes('aria-live'));

// 10. Toast alert uses role=alert for urgent announcements
test('Timer toast uses role=alert for urgency', timerFn.includes("role', 'alert'") || timerFn.includes('role="alert"'));

// 11. Critical state (<=10s) marked as assertive
test('Critical state uses aria-live assertive', timerFn.includes("'assertive'"));

// 12. initTimer returns null if no minutes (already tested in timer-nan-guard, re-confirm)
test('initTimer has null guard for missing minutes', timerFn.match(/if\s*\(.*\)\s*return\s+null/));

console.log('\n' + '='.repeat(50));
console.log('exam-timer-display-contract: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
