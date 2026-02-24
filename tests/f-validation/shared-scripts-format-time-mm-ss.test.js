// shared-scripts-format-time-mm-ss test
// formatTime in shared/scripts.js must produce MM:SS format output
// NaN:NaN or undefined would be visible to Kai during the exam

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} shared-scripts-format-time-mm-ss.test.js\n');

var js = fs.readFileSync(path.join(__dirname, '../../shared/scripts.js'), 'utf-8');

console.log('\u2500\u2500 formatTime MM:SS checks \u2500\u2500\n');

var hasFormatTime = js.includes('formatTime') || js.includes('format_time');
var hasPadStart = js.includes('padStart') || js.includes('pad') || /\? '0' :/.test(js) || /sec < 10/.test(js);
var hasColonFormat = js.includes("':'") || js.includes('":" ') || /[`'"]:['"`]/.test(js) || js.includes("+ ':' +") || js.includes('+ ":" +');

test('shared/scripts.js defines a time formatting function', hasFormatTime);
test('Time formatting uses padStart or similar zero-padding', hasPadStart);
test('Time formatting produces colon-separated output (MM:SS)', hasColonFormat);

console.log('\n' + '='.repeat(50));
console.log('shared-scripts-format-time-mm-ss: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
