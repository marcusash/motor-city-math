// index-title-motor-city test
// index.html <title> must contain "Motor City" to brand the tab
// Generic or empty titles confuse Kai when switching browser tabs

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} index-title-motor-city.test.js\n');

var indexSrc = fs.readFileSync(path.join(__dirname, '../../index.html'), 'utf-8');

console.log('\u2500\u2500 Page title checks \u2500\u2500\n');

// <title> tag present
var titleMatch = indexSrc.match(/<title[^>]*>([^<]+)<\/title>/i);
var hasTitle = !!titleMatch;
test('<title> tag present in index.html', hasTitle);

// Contains "Motor City"
var hasMotorCity = titleMatch && titleMatch[1].includes('Motor City');
test('<title> contains "Motor City"', !!hasMotorCity);

// Not just "Motor City" -- has some detail
var hasDetail = titleMatch && titleMatch[1].length > 12;
test('<title> has descriptive content (>12 chars)', !!hasDetail);

console.log('\n' + '='.repeat(50));
console.log('index-title-motor-city: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
