// css-border-default-token test
// CSS should define a --border-default custom property for consistent borders
// Without a token, border colors get hardcoded and diverge across components

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} css-border-default-token.test.js\n');

var css = fs.readFileSync(path.join(__dirname, '../../shared/styles.css'), 'utf-8');

var hasBorderDefault = /--border-default|--border-color|--color-border/.test(css);

test('CSS defines a --border-default or --border-color token', hasBorderDefault);

console.log('\n' + '='.repeat(50));
console.log('css-border-default-token: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
