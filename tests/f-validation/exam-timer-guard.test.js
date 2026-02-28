// exam-timer-guard test
// exam.html must guard against NaN timer display when time_minutes is missing or invalid

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} exam-timer-guard.test.js\n');

var html = fs.readFileSync(path.join(__dirname, '../../exam.html'), 'utf-8');
var shared = fs.readFileSync(path.join(__dirname, '../../shared/scripts.js'), 'utf-8');

// Timer guard: check for isNaN, || fallback, or guard condition before timer starts
var examHasGuard = /isNaN|parseInt.*\|\||time_minutes.*\|\s*\d+|timeMinutes.*\|\s*\d+/.test(html);
var sharedHasGuard = /isNaN|parseInt.*\|\||time_minutes.*\|\s*\d+|timeMinutes.*\|\s*\d+/.test(shared);

test('Timer NaN guard exists in exam.html or shared/scripts.js', examHasGuard || sharedHasGuard);

console.log('\n' + '='.repeat(50));
console.log('exam-timer-guard: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
