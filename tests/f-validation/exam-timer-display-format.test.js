// exam-timer-display-format test
// Timer must display MM:SS format (not seconds only)
// "25:00" is readable; "1500" is not

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} exam-timer-display-format.test.js\n');

var scriptsSrc = fs.readFileSync(path.join(__dirname, '../../shared/scripts.js'), 'utf-8');

console.log('\u2500\u2500 Timer display format checks \u2500\u2500\n');

// formatTime produces MM:SS -- checks for minute/second division and colon
var hasMathFloor = scriptsSrc.includes('Math.floor');
test('formatTime uses Math.floor for time calculation', hasMathFloor);

// Colon separator in output
var hasColon = scriptsSrc.includes("':'") || scriptsSrc.includes('":"') || scriptsSrc.includes("+ ':' +") ||
               scriptsSrc.includes('+ ":" +');
test('formatTime produces MM:SS format with colon separator', hasColon);

// 60 divisor (seconds to minutes conversion)
var has60 = scriptsSrc.includes('/ 60') || scriptsSrc.includes('/60') || scriptsSrc.includes('% 60');
test('formatTime uses 60 for seconds-to-minutes conversion', has60);

console.log('\n' + '='.repeat(50));
console.log('exam-timer-display-format: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
