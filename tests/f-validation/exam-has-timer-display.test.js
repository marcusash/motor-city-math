// exam-has-timer-display test
// exam.html must show a timer display so Kai can manage his time
// ADHD students lose track of time without a visible countdown

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} exam-has-timer-display.test.js\n');

var html = fs.readFileSync(path.join(__dirname, '../../exam.html'), 'utf-8');

var hasTimerElement = /timer-display|timerDisplay|id\s*=\s*["']timer["']|class\s*=\s*["'][^"']*timer[^"']*["']|data-time-minutes|test-header/i.test(html);
var hasTimerScript = /initTimer|formatTime|startTimer/i.test(html);

test('exam.html has a timer display element', hasTimerElement);
test('exam.html has timer initialization code', hasTimerScript);

console.log('\n' + '='.repeat(50));
console.log('exam-has-timer-display: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
