// css-media-print-hides-ui test
// CSS @media print should hide timer, nav buttons, or UI chrome

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} css-media-print-hides-ui.test.js\n');

var css = fs.readFileSync(path.join(__dirname, '../../shared/styles.css'), 'utf-8');

var printIdx = css.indexOf('@media print');
var hasPrint = printIdx !== -1;
// Check that print block contains display:none for some element
var printBlock = hasPrint ? css.slice(printIdx, printIdx + 600) : '';
var hidesElement = /display\s*:\s*none/.test(printBlock);

test('CSS has @media print block', hasPrint);
test('Print block hides at least one element', hasPrint && hidesElement);

console.log('\n' + '='.repeat(50));
console.log('css-media-print-hides-ui: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
