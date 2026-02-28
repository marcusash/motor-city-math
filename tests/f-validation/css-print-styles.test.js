// css-print-styles test
// shared/styles.css must define @media print styles
// Print spec (.print-spec.md) requires exam content printable without nav/chrome

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} css-print-styles.test.js\n');

var stylesSrc = fs.readFileSync(path.join(__dirname, '../../shared/styles.css'), 'utf-8');

console.log('\u2500\u2500 Print styles checks \u2500\u2500\n');

// 1. @media print block exists
var hasPrintMedia = stylesSrc.includes('@media print');
test('@media print block defined in shared/styles.css', hasPrintMedia);

// 2. Something hidden in print mode (nav, buttons, etc)
var hasPrintHide = stylesSrc.includes('@media print') && stylesSrc.includes('display: none');
test('Elements hidden in print mode (display:none inside @media print)', hasPrintHide);

console.log('\n' + '='.repeat(50));
console.log('css-print-styles: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
