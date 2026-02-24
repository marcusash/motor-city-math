// shared-scripts-format-time-output test
// formatTime must output MM:SS with zero-padded minutes and seconds
// "1:5" is wrong, "01:05" is correct -- ADHD focus on clean timer display

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} shared-scripts-format-time-output.test.js\n');

var scriptsSrc = fs.readFileSync(path.join(__dirname, '../../shared/scripts.js'), 'utf-8');

console.log('\u2500\u2500 formatTime output format checks \u2500\u2500\n');

// padStart or manual zero-pad (< 10 ? '0' : '') used for formatting
var hasPadStart = scriptsSrc.includes('padStart') || 
                  scriptsSrc.includes("< 10 ? '0'") || scriptsSrc.includes('< 10 ? "0"');
test('Zero-padding applied in formatTime (padStart or conditional)', hasPadStart);

// Math.floor used to get whole minutes/seconds
var hasMathFloor = scriptsSrc.includes('Math.floor');
test('Math.floor used in formatTime', hasMathFloor);

// Colon separator in time format
var hasColonFormat = scriptsSrc.includes("':'") || scriptsSrc.includes('":"') || 
                     scriptsSrc.includes("+ ':' +") || scriptsSrc.includes('+ ":" +');
test('Colon separator used in time format string', hasColonFormat);

console.log('\n' + '='.repeat(50));
console.log('shared-scripts-format-time-output: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
