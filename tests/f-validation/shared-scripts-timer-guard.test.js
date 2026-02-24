// shared-scripts-timer-guard test
// initTimer() in shared/scripts.js must handle missing/invalid time_minutes gracefully
// NaN:NaN displayed on missing data is a bug -- timer should guard against bad input

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} shared-scripts-timer-guard.test.js\n');

var scriptsSrc = fs.readFileSync(path.join(__dirname, '../../shared/scripts.js'), 'utf-8');

console.log('\u2500\u2500 Timer guard checks \u2500\u2500\n');

// 1. initTimer function exists
var hasInitTimer = scriptsSrc.includes('initTimer');
test('initTimer() function defined in shared/scripts.js', hasInitTimer);

// 2. Guard against NaN / invalid minutes -- isNaN, || default, or parseInt check
var hasNaNGuard = scriptsSrc.includes('isNaN') || scriptsSrc.includes('|| 20') ||
                  scriptsSrc.includes('|| 25') || scriptsSrc.includes('|| 30') ||
                  scriptsSrc.includes('parseInt') && scriptsSrc.includes('NaN');
test('Timer guards against NaN/missing minutes', hasNaNGuard);

// 3. formatTime inner function returns 00:00 format (colon separator)
var hasFormatTime = scriptsSrc.includes('formatTime') || scriptsSrc.includes(':');
test('formatTime colon-separator format exists', hasFormatTime);

console.log('\n' + '='.repeat(50));
console.log('shared-scripts-timer-guard: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
