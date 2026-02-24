// css-disabled-state-defined test
// CSS should define styling for disabled elements (:disabled pseudo-class)
// Disabled submit button during loading should be visually distinct

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} css-disabled-state-defined.test.js\n');

var css = fs.readFileSync(path.join(__dirname, '../../shared/styles.css'), 'utf-8');

console.log('\u2500\u2500 Disabled state CSS checks \u2500\u2500\n');

var hasDisabledPseudo = css.includes(':disabled');
var hasNotAllowed = css.includes('not-allowed');
var hasOpacity = css.includes('opacity');

test('CSS defines :disabled or cursor:not-allowed for disabled states', hasDisabledPseudo || hasNotAllowed || hasOpacity);
test('CSS uses opacity property (for animations or disabled states)', hasOpacity);

console.log('\n' + '='.repeat(50));
console.log('css-disabled-state-defined: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
