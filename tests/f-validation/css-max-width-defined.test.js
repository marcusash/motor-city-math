// css-max-width-defined test
// CSS must define max-width to prevent content from stretching too wide on large screens
// Without max-width, text lines exceed readable limits (>80 chars)

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} css-max-width-defined.test.js\n');

var css = fs.readFileSync(path.join(__dirname, '../../shared/styles.css'), 'utf-8');

var maxWidthValues = css.match(/max-width\s*:\s*\d+px/g) || [];
var hasLargeMaxWidth = maxWidthValues.some(function(v) {
    var px = parseInt(v.match(/\d+/)[0]);
    return px >= 800;
});

test('CSS defines max-width', maxWidthValues.length > 0);
test('CSS defines max-width >= 800px for content container', hasLargeMaxWidth);
console.log('  max-width values: ' + maxWidthValues.join(', '));

console.log('\n' + '='.repeat(50));
console.log('css-max-width-defined: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
