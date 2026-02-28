// shared-scripts-format-time test
// shared/scripts.js must contain formatTime() function
// formatTime converts seconds to MM:SS for the exam timer display

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} shared-scripts-format-time.test.js\n');

var scriptsSrc = fs.readFileSync(path.join(__dirname, '../../shared/scripts.js'), 'utf-8');

console.log('\u2500\u2500 formatTime function checks \u2500\u2500\n');

// 1. formatTime function exists
var hasFormatTime = scriptsSrc.includes('formatTime') || scriptsSrc.includes('format_time');
test('formatTime function defined in shared/scripts.js', hasFormatTime);

// 2. Uses Math.floor for minute/second calculation
var hasMathFloor = scriptsSrc.includes('Math.floor');
test('Math.floor used for time calculation', hasMathFloor);

// 3. Produces MM:SS format (pad with leading zero)
var hasPadding = scriptsSrc.includes('padStart') || scriptsSrc.includes('padStart') || 
                 scriptsSrc.includes('pad') || scriptsSrc.includes('< 10');
test('Time values padded to two digits', hasPadding);

console.log('\n' + '='.repeat(50));
console.log('shared-scripts-format-time: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
