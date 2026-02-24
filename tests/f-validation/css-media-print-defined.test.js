// css-media-print-defined test
// styles.css must have @media print rules for when Kai prints practice sheets
// Print styles should hide UI chrome and show only question content

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} css-media-print-defined.test.js\n');

var cssSrc = fs.readFileSync(path.join(__dirname, '../../shared/styles.css'), 'utf-8');

console.log('\u2500\u2500 @media print checks \u2500\u2500\n');

// @media print defined
var hasPrint = cssSrc.includes('@media print');
test('@media print block defined in styles.css', hasPrint);

// display:none used in print (to hide UI elements)
var printBlock = hasPrint ? cssSrc.slice(cssSrc.indexOf('@media print')) : '';
var hidesElements = printBlock.includes('display: none') || printBlock.includes('display:none');
test('@media print hides non-content elements', hidesElements);

console.log('\n' + '='.repeat(50));
console.log('css-media-print-defined: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
