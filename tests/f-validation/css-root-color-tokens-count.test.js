// css-root-color-tokens-count test
// :root should define at least 20 CSS custom property tokens
// Rich token system enables consistent theming

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} css-root-color-tokens-count.test.js\n');

var css = fs.readFileSync(path.join(__dirname, '../../shared/styles.css'), 'utf-8');

// Extract all :root blocks (there may be multiple)
var rootMatches = css.match(/:root\s*\{([^}]+)\}/g) || [];
var rootContent = rootMatches.join('\n');

var tokenCount = (rootContent.match(/--[a-zA-Z][a-zA-Z0-9_-]*\s*:/g) || []).length;

test(':root defines >= 20 CSS custom properties (found: ' + tokenCount + ')', tokenCount >= 20);

console.log('\n' + '='.repeat(50));
console.log('css-root-color-tokens-count: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
