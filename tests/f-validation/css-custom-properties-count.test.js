// css-custom-properties-count test
// CSS should define a meaningful number of custom properties (design tokens)
// Too few tokens means hardcoded values scattered everywhere (maintenance risk)

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} css-custom-properties-count.test.js\n');

var css = fs.readFileSync(path.join(__dirname, '../../shared/styles.css'), 'utf-8');

var tokens = (css.match(/--[a-z][a-z0-9-]+\s*:/g) || []);
var uniqueTokens = [...new Set(tokens)].length;
var MIN_TOKENS = 20;

test('CSS defines at least ' + MIN_TOKENS + ' custom properties (' + uniqueTokens + ' found)', uniqueTokens >= MIN_TOKENS);

console.log('\n' + '='.repeat(50));
console.log('css-custom-properties-count: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
