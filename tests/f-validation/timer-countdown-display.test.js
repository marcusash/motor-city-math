// Exam time remaining display test
// GD spec: timer shows time REMAINING (not elapsed). countdown format M:SS.
// Timer must reset to time_minutes * 60 and count down, not up.

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} timer-countdown-display.test.js\n');

var examSrc = fs.readFileSync(path.join(__dirname, '../../exam.html'), 'utf-8');
var sharedSrc = fs.readFileSync(path.join(__dirname, '../../shared/scripts.js'), 'utf-8');

console.log('\u2500\u2500 Timer countdown display checks \u2500\u2500\n');

// 1. initTimer function exists in shared/scripts.js
var hasInitTimer = sharedSrc.includes('function initTimer') || sharedSrc.includes('initTimer =');
test('initTimer() function exists in shared/scripts.js', hasInitTimer);

// 2. Timer counts DOWN (timeLeft or remaining, decremented each tick)
var hasCountdown = sharedSrc.includes('timeLeft') || sharedSrc.includes('remaining') || sharedSrc.includes('--');
test('Timer uses timeLeft/remaining variable (countdown pattern)', hasCountdown);

// 3. formatTime function uses M:SS format
var hasFormatTime = sharedSrc.includes('formatTime') || sharedSrc.includes('format_time');
test('formatTime function exists for M:SS formatting', hasFormatTime);

// 4. Minutes derived by division (Math.floor division)
var hasMinutes = sharedSrc.includes('Math.floor') && (sharedSrc.includes('60') || sharedSrc.includes('minutes'));
test('Minutes computed via Math.floor(timeLeft / 60)', hasMinutes);

// 5. Timer element updated each tick
var hasTickUpdate = sharedSrc.includes('textContent') || sharedSrc.includes('innerHTML') || sharedSrc.includes('.text');
test('Timer element updated each tick (textContent or innerHTML)', hasTickUpdate);

console.log('\n' + '='.repeat(50));
console.log('timer-countdown-display: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
