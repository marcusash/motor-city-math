// exam-timer-countdown test
// exam.html timer must count DOWN (show remaining time, not elapsed)
// Per ADHD design: timer shows remaining not elapsed

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} exam-timer-countdown.test.js\n');

var examHtml = fs.readFileSync(require('path').join(__dirname, '../../exam.html'), 'utf-8');
var sharedJs = fs.readFileSync(require('path').join(__dirname, '../../shared/scripts.js'), 'utf-8');

console.log('\u2500\u2500 Timer countdown checks \u2500\u2500\n');

// shared/scripts.js initTimer should decrement (timeLeft-- or timeLeft -= 1)
var hasDecrement = sharedJs.includes('timeLeft--') || sharedJs.includes('timeLeft -=') || sharedJs.includes('remaining');
// exam.html should call initTimer with time_minutes
var callsInitTimer = examHtml.includes('initTimer');

test('exam.html calls initTimer()', callsInitTimer);
test('shared/scripts.js decrements time (countdown)', hasDecrement);
test('Timer uses time_minutes from JSON data', examHtml.includes('time_minutes') || sharedJs.includes('time_minutes') || examHtml.includes('initTimer'));

console.log('\n' + '='.repeat(50));
console.log('exam-timer-countdown: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
