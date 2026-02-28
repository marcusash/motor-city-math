// index-responsive-meta-viewport test
// index.html must have a proper meta viewport tag for mobile
// Missing viewport makes the dashboard unusable on Kai's phone

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} index-responsive-meta-viewport.test.js\n');

var indexSrc = fs.readFileSync(path.join(__dirname, '../../index.html'), 'utf-8');

console.log('\u2500\u2500 Meta viewport checks \u2500\u2500\n');

// 1. viewport meta tag present
var hasViewport = indexSrc.includes('name="viewport"') || indexSrc.includes("name='viewport'");
test('meta viewport tag present in index.html', hasViewport);

// 2. width=device-width (not fixed width)
var hasDeviceWidth = indexSrc.includes('width=device-width');
test('viewport width=device-width (not fixed pixel width)', hasDeviceWidth);

// 3. initial-scale=1 (not zoomed in or out)
var hasInitialScale = indexSrc.includes('initial-scale=1');
test('viewport initial-scale=1 defined', hasInitialScale);

console.log('\n' + '='.repeat(50));
console.log('index-responsive-meta-viewport: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
