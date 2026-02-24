// shared-scripts-init-timer test
// shared/scripts.js initTimer() must be defined and use setInterval
// Timer counts down from time_minutes to 0

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} shared-scripts-init-timer.test.js\n');

var scriptsSrc = fs.readFileSync(path.join(__dirname, '../../shared/scripts.js'), 'utf-8');

console.log('\u2500\u2500 initTimer function checks \u2500\u2500\n');

// initTimer defined
var hasInitTimer = scriptsSrc.includes('function initTimer') || scriptsSrc.includes('initTimer =');
test('initTimer function defined in shared/scripts.js', hasInitTimer);

// setInterval used (timer is interval-based, not timeout chain)
var hasSetInterval = scriptsSrc.includes('setInterval');
test('setInterval used for countdown timer', hasSetInterval);

// Timer counts down (decrement: remaining-- or remaining -= 1)
var hasDecrement = scriptsSrc.includes('remaining--') || scriptsSrc.includes('remaining -= 1') ||
                   scriptsSrc.includes('remaining - 1') || scriptsSrc.includes('--remaining');
test('Timer decrements remaining time', hasDecrement);

console.log('\n' + '='.repeat(50));
console.log('shared-scripts-init-timer: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
