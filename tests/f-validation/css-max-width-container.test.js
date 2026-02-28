// css-max-width-container test
// CSS should define a max-width for the main container
// to prevent content from stretching too wide on large screens

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} css-max-width-container.test.js\n');

var css = fs.readFileSync(path.join(__dirname, '../../shared/styles.css'), 'utf-8');

console.log('\u2500\u2500 Max-width container checks \u2500\u2500\n');

var maxWidthMatches = css.match(/max-width\s*:\s*[\d]+px/g) || [];
var hasMaxWidth = maxWidthMatches.length > 0;
// Container max-width should be at least 800px (meaningful constraint)
var hasReasonableMaxWidth = maxWidthMatches.some(function(m) {
    var px = parseInt(m.match(/(\d+)/)[1]);
    return px >= 800;
});

test('CSS defines max-width for container', hasMaxWidth);
test('Max-width constraint is >= 800px (meaningful constraint)', hasReasonableMaxWidth);

console.log('  max-width declarations: ' + maxWidthMatches.length + ' (' + maxWidthMatches.slice(0,3).join(', ') + ')');

console.log('\n' + '='.repeat(50));
console.log('css-max-width-container: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
