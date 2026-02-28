// shared-styles-box-sizing test
// All elements should use box-sizing: border-box for predictable layout
// MCM uses the universal selector reset pattern

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} shared-styles-box-sizing.test.js\n');

var stylesSrc = fs.readFileSync(path.join(__dirname, '../../shared/styles.css'), 'utf-8');

console.log('\u2500\u2500 Box sizing checks \u2500\u2500\n');

// 1. border-box reset exists
var hasBorderBox = stylesSrc.includes('border-box');
test('border-box defined in shared/styles.css', hasBorderBox);

// 2. Universal selector or *, *::before, *::after
var hasUniversal = stylesSrc.includes('*, *') || stylesSrc.includes('*,*') ||
                   stylesSrc.includes('*, ') || (stylesSrc.includes('*{') || stylesSrc.includes('* {'));
test('Universal selector used for box-sizing reset', hasUniversal);

// 3. body has margin: 0 or padding: 0 reset
var hasBodyReset = stylesSrc.includes('margin: 0') || stylesSrc.includes('margin:0') ||
                   stylesSrc.includes('padding: 0') || stylesSrc.includes('padding:0');
test('Body/base margin or padding reset defined', hasBodyReset);

console.log('\n' + '='.repeat(50));
console.log('shared-styles-box-sizing: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
