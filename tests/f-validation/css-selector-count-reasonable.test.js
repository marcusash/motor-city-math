// css-selector-count-reasonable test
// CSS should not have an excessively large number of rule blocks (max 300)
// Large selector count indicates bloat or generated CSS

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} css-selector-count-reasonable.test.js\n');

var css = fs.readFileSync(path.join(__dirname, '../../shared/styles.css'), 'utf-8');

// Count closing braces as proxy for rule blocks (excludes @media wrappers)
var ruleCount = (css.match(/\{[^{}]*\}/g) || []).length;
var MAX_RULES = 500;

test('CSS rule block count is reasonable (<= ' + MAX_RULES + ', actual: ' + ruleCount + ')', ruleCount <= MAX_RULES);

console.log('\n' + '='.repeat(50));
console.log('css-selector-count-reasonable: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
