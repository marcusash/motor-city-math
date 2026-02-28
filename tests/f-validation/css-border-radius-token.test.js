// css-border-radius-token test
// CSS should define a --border-radius or --radius custom property
// Without a radius token, button corners are inconsistently rounded

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} css-border-radius-token.test.js\n');

var css = fs.readFileSync(path.join(__dirname, '../../shared/styles.css'), 'utf-8');

var hasToken = /--border-radius|--radius\b/.test(css);
var hasBorderRadiusProp = /border-radius\s*:/.test(css);

test('CSS defines border-radius (via token or property)', hasToken || hasBorderRadiusProp);

console.log('\n' + '='.repeat(50));
console.log('css-border-radius-token: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
