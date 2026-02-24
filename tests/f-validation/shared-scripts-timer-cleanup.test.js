// shared-scripts-timer-cleanup test
// shared/scripts.js initTimer must clear the interval on completion
// (prevents memory leaks and timer ghost runs)

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} shared-scripts-timer-cleanup.test.js\n');

var js = fs.readFileSync(path.join(__dirname, '../../shared/scripts.js'), 'utf-8');

console.log('\u2500\u2500 Timer cleanup checks \u2500\u2500\n');

var hasSetInterval = js.includes('setInterval');
var hasClearInterval = js.includes('clearInterval');

test('shared/scripts.js uses setInterval for countdown timer', hasSetInterval);
test('shared/scripts.js uses clearInterval to clean up timer', hasClearInterval);

console.log('\n' + '='.repeat(50));
console.log('shared-scripts-timer-cleanup: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
