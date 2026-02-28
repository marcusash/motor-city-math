// css-breakpoint-768-primary test
// The primary breakpoint at 768px (tablet) must be defined in shared/styles.css
// This is the standard tablet width in the responsive spec

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} css-breakpoint-768-primary.test.js\n');

var css = fs.readFileSync(path.join(__dirname, '../../shared/styles.css'), 'utf-8');

var has768 = /768px/.test(css);
var mediaCount768 = (css.match(/768px/g) || []).length;

test('CSS defines the 768px primary breakpoint', has768);
test('768px breakpoint is used multiple times (>= 2)', mediaCount768 >= 2);
console.log('  768px occurrences: ' + mediaCount768);

console.log('\n' + '='.repeat(50));
console.log('css-breakpoint-768-primary: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
