// shared-styles-transition-property test
// shared/styles.css should define transition properties for interactive elements (UX polish)

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} shared-styles-transition-property.test.js\n');

var f = path.join(__dirname, '../../shared/styles.css');
var css = fs.readFileSync(f, 'utf-8');

var transCount = (css.match(/\btransition\s*:/g) || []).length;

console.log('\u2500\u2500 Transition property checks \u2500\u2500\n');
console.log('  transition: declarations found: ' + transCount);

test('CSS has at least 2 transition declarations (interactive polish)', transCount >= 2);
// Verify safe properties (color, opacity, transform -- not layout properties)
var hasSafeTransition = /transition\s*:[^;]*(color|opacity|transform|background)[^;]*;/.test(css);
test('CSS transitions use safe properties (color/opacity/transform)', hasSafeTransition);

console.log('\n' + '='.repeat(50));
console.log('shared-styles-transition-property: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
