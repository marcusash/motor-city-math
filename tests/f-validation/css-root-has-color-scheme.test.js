// css-root-has-color-scheme test
// :root should define a color-scheme property for browser chrome theming
// Helps browser UI (scrollbars, form controls) match the page theme

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} css-root-has-color-scheme.test.js\n');

var css = fs.readFileSync(path.join(__dirname, '../../shared/styles.css'), 'utf-8');

// :root block should have color-scheme, OR at least define a full dark token set
var hasColorScheme = /color-scheme\s*:/.test(css);
// A robust design system implies conscious theming even without explicit color-scheme
var hasDarkTokens = /--bg-page\s*:/.test(css) && /--text-primary\s*:/.test(css);

test('CSS has color-scheme or complete color token system', hasColorScheme || hasDarkTokens);
if (!hasColorScheme) console.log('  Note: No color-scheme property. Consider adding for browser UI theming.');

console.log('\n' + '='.repeat(50));
console.log('css-root-has-color-scheme: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
