// css-accent-color-defined test
// CSS must define an accent color token for consistent interactive element styling
// The Motor City Math accent color is the Pistons red (#C8102E)

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} css-accent-color-defined.test.js\n');

var css = fs.readFileSync(path.join(__dirname, '../../shared/styles.css'), 'utf-8');

var hasAccentToken = /--accent[^;]*:/.test(css);
var hasPistonsRed  = /#C8102E|#c8102e/i.test(css);

test('CSS defines --accent color token', hasAccentToken);
test('CSS includes Pistons red (#C8102E)', hasPistonsRed);

console.log('\n' + '='.repeat(50));
console.log('css-accent-color-defined: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
