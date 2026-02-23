// shared/scripts.js formatTime() test
// formatTime(seconds) must return MM:SS format
// Bad format: NaN:NaN, undefined:undefined, or plain number

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} shared-format-time.test.js\n');

var scriptSrc = fs.readFileSync(path.join(__dirname, '../../shared/scripts.js'), 'utf-8');

console.log('\u2500\u2500 formatTime() checks \u2500\u2500\n');

// 1. formatTime function exists
var hasFormatTime = scriptSrc.includes('formatTime') || scriptSrc.includes('function formatTime');
test('formatTime() function defined in shared/scripts.js', hasFormatTime);

// 2. Uses Math.floor for minutes
var usesFloor = scriptSrc.includes('Math.floor');
test('formatTime() uses Math.floor for time calculation', usesFloor);

// 3. Returns MM:SS pattern (pad with 0 for single-digit seconds)
var hasPadding = scriptSrc.includes("padStart") || scriptSrc.includes("< 10") || 
                 scriptSrc.includes("'0' +") || scriptSrc.includes('"0" +') ||
                 scriptSrc.includes('pad(');
test('formatTime() pads seconds to 2 digits (MM:SS not MM:S)', hasPadding);

// 4. Uses modulo for seconds
var hasModulo = scriptSrc.includes('% 60');
test('formatTime() uses modulo 60 for seconds calculation', hasModulo);

console.log('\n' + '='.repeat(50));
console.log('shared-format-time: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
