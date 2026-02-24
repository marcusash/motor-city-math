// exam-timer-visible test
// exam.html must display a visible countdown timer
// Timer visibility is a core ADHD support feature per .timer-spec.md

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} exam-timer-visible.test.js\n');

var examSrc = fs.readFileSync(path.join(__dirname, '../../exam.html'), 'utf-8');

console.log('\u2500\u2500 Timer visibility checks \u2500\u2500\n');

// 1. Timer display element
var hasTimerEl = examSrc.includes('timer') || examSrc.includes('Timer');
test('Timer element present in exam.html', hasTimerEl);

// 2. initTimer called
var hasInitTimer = examSrc.includes('initTimer');
test('initTimer() called in exam.html', hasInitTimer);

// 3. Time remaining displayed (not elapsed) per spec
var hasTimeRemaining = examSrc.includes('time_minutes') || examSrc.includes('timeRemaining') || 
                       examSrc.includes('countdown');
test('Timer uses remaining time (countdown) per .timer-spec.md', hasTimeRemaining);

console.log('\n' + '='.repeat(50));
console.log('exam-timer-visible: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
