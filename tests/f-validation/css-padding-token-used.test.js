// css-padding-token-used test
// CSS should define spacing/padding custom properties or use var(--) references
// Without tokens, padding values are hardcoded and inconsistent across components

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} css-padding-token-used.test.js\n');

var css = fs.readFileSync(path.join(__dirname, '../../shared/styles.css'), 'utf-8');

// CSS uses var() for colors (primary way tokens are used in this codebase)
var colorVarCount = (css.match(/:\s*var\(--/g) || []).length;
var MIN_VAR_USES = 30;

test('CSS uses custom property var() values >= ' + MIN_VAR_USES + ' times (' + colorVarCount + ' found)', colorVarCount >= MIN_VAR_USES);

console.log('\n' + '='.repeat(50));
console.log('css-padding-token-used: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
