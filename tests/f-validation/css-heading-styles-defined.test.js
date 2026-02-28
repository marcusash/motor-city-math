// css-heading-styles-defined test
// shared/styles.css must style heading elements (h1/h2/h3)
// Unstyled headings would render with browser defaults that may clash with design

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} css-heading-styles-defined.test.js\n');

var css = fs.readFileSync(path.join(__dirname, '../../shared/styles.css'), 'utf-8');

console.log('\u2500\u2500 Heading style checks \u2500\u2500\n');

var hasH1 = /\bh1\b/.test(css);
var hasH2 = /\bh2\b/.test(css);
var hasH3 = /\bh3\b/.test(css);

test('CSS styles h1 elements', hasH1);
test('CSS styles h2 or h3 elements', hasH2 || hasH3);

console.log('  h1: ' + hasH1 + ', h2: ' + hasH2 + ', h3: ' + hasH3);

console.log('\n' + '='.repeat(50));
console.log('css-heading-styles-defined: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
