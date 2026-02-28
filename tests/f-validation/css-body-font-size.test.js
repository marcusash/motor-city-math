// css-body-font-size test
// shared/styles.css should define a body font size (readability for Kai)

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} css-body-font-size.test.js\n');

var f = path.join(__dirname, '../../shared/styles.css');
var css = fs.readFileSync(f, 'utf-8');

console.log('\u2500\u2500 Body font size checks \u2500\u2500\n');

var hasBodyFontSize = /body\s*\{[^}]*font-size/.test(css.replace(/\n/g, ' ')) ||
                      /body[^}]+font-size/.test(css.replace(/\n/g, ' '));
var hasFontFamilyVar = css.includes('--font-body') || css.includes("font-family");

test('CSS defines font-size for body or root', hasBodyFontSize || /(:root|html)\s*\{[^}]*font-size/.test(css.replace(/\n/g, ' ')));
test('CSS defines font-family (--font-body variable)', hasFontFamilyVar);

console.log('\n' + '='.repeat(50));
console.log('css-body-font-size: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
