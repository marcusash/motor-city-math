// css-font-weight-tokens test
// CSS should use font-weight values from a defined set (not arbitrary numbers)
// Valid: 400 (normal), 500 (medium), 600 (semibold), 700 (bold)

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} css-font-weight-tokens.test.js\n');

var css = fs.readFileSync(path.join(__dirname, '../../shared/styles.css'), 'utf-8');

console.log('\u2500\u2500 Font weight checks \u2500\u2500\n');

var fontWeights = css.match(/font-weight\s*:\s*(\d+|bold|normal|lighter|bolder)/g) || [];
var valid = new Set(['400', '500', '600', '700', '800', 'bold', 'normal', 'lighter', 'bolder']);
var invalid = fontWeights.filter(function(fw) {
    var val = fw.replace(/font-weight\s*:\s*/, '').trim();
    return !valid.has(val);
});

test('CSS uses standard font-weight values only', invalid.length === 0);
test('CSS defines at least one font-weight', fontWeights.length > 0);

if (invalid.length) invalid.forEach(function(v) { console.log('  ! Non-standard: ' + v); });
console.log('  Font-weight declarations: ' + fontWeights.length);

console.log('\n' + '='.repeat(50));
console.log('css-font-weight-tokens: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
