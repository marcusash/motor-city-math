// css-body-selector-defined test
// shared/styles.css must define a body{} selector with at least font-family
// Without it, browser defaults apply and the design system breaks

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} css-body-selector-defined.test.js\n');

var css = fs.readFileSync(path.join(__dirname, '../../shared/styles.css'), 'utf-8');

var hasBodySelector = /^body\s*\{/m.test(css);
var bodyBlock = css.match(/^body\s*\{([^}]+)\}/m);
var hasFontFamily = bodyBlock && /font-family/.test(bodyBlock[1]);
var hasMarginOrPadding = bodyBlock && (/margin\s*:\s*0/.test(bodyBlock[1]) || /padding/.test(bodyBlock[1]));

test('CSS defines a body{} selector', hasBodySelector);
test('body{} includes font-family', !!hasFontFamily);
test('body{} has margin or padding reset', !!hasMarginOrPadding);

console.log('\n' + '='.repeat(50));
console.log('css-body-selector-defined: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
