// css-transition-property-not-all test
// Transitions should not use "transition: all" -- it causes performance issues
// Specific property transitions are better for animation performance

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} css-transition-property-not-all.test.js\n');

var css = fs.readFileSync(path.join(__dirname, '../../shared/styles.css'), 'utf-8');

var transitionAll = (css.match(/transition\s*:\s*all\b/g) || []);
var MAX_ALL = 3; // Allow a few for convenience

test('CSS uses transition:all <= ' + MAX_ALL + ' times (actual: ' + transitionAll.length + ')', transitionAll.length <= MAX_ALL);
if (transitionAll.length > MAX_ALL) {
    console.log('    ! ' + transitionAll.length + ' transition:all found. Use specific properties for performance.');
}

console.log('\n' + '='.repeat(50));
console.log('css-transition-property-not-all: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
