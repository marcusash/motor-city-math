// css-color-contrast-variables test
// CSS must define distinct foreground and background color tokens
// Token names suggest foreground (text-*) and background (bg-*) pairing

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} css-color-contrast-variables.test.js\n');

var css = fs.readFileSync(path.join(__dirname, '../../shared/styles.css'), 'utf-8');

// Check for separate text and background color tokens
var textTokens = (css.match(/--text-[a-z-]+\s*:/g) || []);
var bgTokens   = (css.match(/--bg-[a-z-]+\s*:/g) || []);

test('CSS defines text color tokens (--text-*)', textTokens.length >= 2);
test('CSS defines background color tokens (--bg-*)', bgTokens.length >= 2);
console.log('  --text-* tokens: ' + textTokens.length + ', --bg-* tokens: ' + bgTokens.length);

console.log('\n' + '='.repeat(50));
console.log('css-color-contrast-variables: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
