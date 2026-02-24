// css-button-hover-state test
// Buttons must have :hover styles defined for mouse users
// No hover state makes buttons feel unresponsive

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} css-button-hover-state.test.js\n');

var css = fs.readFileSync(path.join(__dirname, '../../shared/styles.css'), 'utf-8');

// Must have at least one :hover selector on button-like elements
var buttonHoverCount = (css.match(/button\s*:hover|\.btn[^:]*:hover|\.nav-btn[^:]*:hover/g) || []).length;

test('CSS has :hover styles on button elements (>= 1)', buttonHoverCount >= 1);
console.log('  button :hover rules: ' + buttonHoverCount);

console.log('\n' + '='.repeat(50));
console.log('css-button-hover-state: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
