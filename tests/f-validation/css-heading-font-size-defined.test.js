// css-heading-font-size-defined test
// CSS must define heading styles (h1, h2, or .heading) with larger font sizes
// Without heading sizes, all text looks the same (poor readability hierarchy)

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} css-heading-font-size-defined.test.js\n');

var css = fs.readFileSync(path.join(__dirname, '../../shared/styles.css'), 'utf-8');

// h1, h2, or --font-size-heading or .title class with font-size
var hasH1FontSize    = /h1\s*\{[^}]*font-size/s.test(css);
var hasH2FontSize    = /h2\s*\{[^}]*font-size/s.test(css);
var hasHeadingToken  = /--font-size-heading|--size-heading|--heading-size/.test(css);
var hasTitleClass    = /\.title[^{]*\{[^}]*font-size/s.test(css);

test('CSS defines heading font sizes (h1/h2/token/class)', hasH1FontSize || hasH2FontSize || hasHeadingToken || hasTitleClass);

console.log('\n' + '='.repeat(50));
console.log('css-heading-font-size-defined: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
