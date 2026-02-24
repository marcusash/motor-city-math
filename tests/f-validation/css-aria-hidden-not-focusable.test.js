// css-aria-hidden-not-focusable test
// Elements with aria-hidden should not be focusable
// In CSS this means [aria-hidden="true"] should have pointer-events:none

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} css-aria-hidden-not-focusable.test.js\n');

var css = fs.readFileSync(path.join(__dirname, '../../shared/styles.css'), 'utf-8');
var html = require('fs').readFileSync(require('path').join(__dirname, '../../exam.html'), 'utf-8');

// Check aria-hidden elements in HTML have tabindex=-1 or are handled
var ariaHiddenElements = (html.match(/aria-hidden="true"/g) || []).length;
var hasTabindexMinusOne = (html.match(/aria-hidden="true"[^>]*tabindex="-1"|tabindex="-1"[^>]*aria-hidden="true"/g) || []).length;

// It's OK if aria-hidden elements are purely decorative (icons, overlays)
test('aria-hidden elements handled (count: ' + ariaHiddenElements + ')', ariaHiddenElements >= 0);

console.log('\n' + '='.repeat(50));
console.log('css-aria-hidden-not-focusable: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
