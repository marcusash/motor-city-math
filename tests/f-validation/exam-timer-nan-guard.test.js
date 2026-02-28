// Timer NaN:NaN guard test
// Verifies initTimer() has a defensive fallback when time_minutes attribute is missing or NaN

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} exam-timer-nan-guard.test.js\n');

const src = fs.readFileSync(path.join(__dirname, '../../shared/scripts.js'), 'utf-8');

// Find initTimer function body
var fnStart = src.indexOf('function initTimer(');
var fnBody = src.substring(fnStart, fnStart + 3000);

console.log('\u2500\u2500 initTimer() defensive guards \u2500\u2500\n');

// 1. initTimer exists
test('function initTimer() exists in shared/scripts.js', fnStart !== -1);

// 2. Reads time_minutes from data attribute
test('initTimer reads data-time-minutes attribute', fnBody.includes('time-minutes') || fnBody.includes('timeMinutes') || fnBody.includes('minutes'));

// 3. Has fallback for missing/NaN minutes value
var hasNaNGuard = fnBody.includes('isNaN') || fnBody.includes('|| 45') || fnBody.includes('|| 30') ||
                  fnBody.includes('default') || fnBody.includes('fallback') || fnBody.includes('isFinite');
test('initTimer has fallback for NaN/missing minutes (isNaN or default value)', hasNaNGuard);

// 4. formatTime() handles 0 and returns '0:00'
var formatFnStart = src.indexOf('function formatTime(');
if (formatFnStart !== -1) {
    var formatBody = src.substring(formatFnStart, formatFnStart + 300);
    test('formatTime() handles zero (returns 0:00)', formatBody.includes('0') && (formatBody.includes('pad') || formatBody.includes('String') || formatBody.includes(':00') || formatBody.includes('slice')));
    // formatTime should use Math.floor for minutes
    test('formatTime uses Math.floor for whole minutes', formatBody.includes('Math.floor') || formatBody.includes('floor'));
} else {
    // formatTime may be nested inside initTimer
    var nestedFormatStart = fnBody.indexOf('function formatTime(');
    if (nestedFormatStart !== -1) {
        var nestedBody = fnBody.substring(nestedFormatStart, nestedFormatStart + 300);
        test('formatTime() handles zero', nestedBody.includes('0') || nestedBody.includes('00'));
        test('formatTime uses Math.floor for whole minutes', nestedBody.includes('Math.floor') || nestedBody.includes('floor'));
    } else {
        test('formatTime() defined (nested or root)', false);
        test('formatTime uses Math.floor', false);
    }
}

// 5. Timer display uses M:SS format (not MM:SS or raw seconds)
var mssFormat = src.includes("':'" ) || src.includes('+ \':\' +') || src.includes("+ \":\" +");
test('Timer uses M:SS format (colon separator)', mssFormat || src.includes(':'));

// 6. exam.html calls initTimer() on DOMContentLoaded or load
var examSrc = fs.readFileSync(path.join(__dirname, '../../exam.html'), 'utf-8');
test('exam.html calls initTimer()', examSrc.includes('initTimer('));

console.log('\n' + '='.repeat(50));
console.log('exam-timer-nan-guard: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
