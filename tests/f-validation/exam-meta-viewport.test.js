// exam-meta-viewport test
// exam.html must have a proper viewport meta tag for mobile rendering

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} exam-meta-viewport.test.js\n');

var html = fs.readFileSync(path.join(__dirname, '../../exam.html'), 'utf-8');

console.log('\u2500\u2500 Viewport meta checks \u2500\u2500\n');

var hasViewport = html.includes('name="viewport"') || html.includes("name='viewport'");
var hasWidthDevice = html.includes('width=device-width');
var hasInitialScale = html.includes('initial-scale=1');

test('exam.html has viewport meta tag', hasViewport);
test('viewport has width=device-width', hasWidthDevice);
test('viewport has initial-scale=1', hasInitialScale);

console.log('\n' + '='.repeat(50));
console.log('exam-meta-viewport: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
