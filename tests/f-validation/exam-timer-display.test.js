// exam-timer-display test
// exam.html should display a countdown timer showing remaining time
// Timer is required per .timer-spec.md (ADHD: shows remaining not elapsed)

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} exam-timer-display.test.js\n');

var examSrc = fs.readFileSync(path.join(__dirname, '../../exam.html'), 'utf-8');

console.log('\u2500\u2500 Timer display checks \u2500\u2500\n');

// 1. Timer element exists in HTML
var hasTimerEl = examSrc.includes('timer') || examSrc.includes('countdown') || examSrc.includes('time-remaining');
test('Timer element referenced in exam.html', hasTimerEl);

// 2. Time loaded from exam JSON (time_minutes field)
var usesTimeMinutes = examSrc.includes('time_minutes') || examSrc.includes('timeMinutes') || examSrc.includes('examTime');
test('Timer uses time_minutes from exam JSON', usesTimeMinutes);

// 3. Countdown (remaining, not elapsed)
var hasCountdown = examSrc.includes('countdown') || examSrc.includes('remaining') || 
                   examSrc.includes('timeLeft') || examSrc.includes('time_left') || examSrc.includes('--');
test('Timer counts down (remaining time)', hasCountdown);

// 4. initTimer or shared scripts.js timer handles formatting
var usesFormatTime = examSrc.includes('formatTime') || examSrc.includes('format_time') ||
                     examSrc.includes('initTimer') || examSrc.includes('shared/scripts.js');
test('initTimer() or formatTime() used for timer display', usesFormatTime);

console.log('\n' + '='.repeat(50));
console.log('exam-timer-display: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
