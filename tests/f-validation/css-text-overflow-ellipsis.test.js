// css-text-overflow-ellipsis test
// CSS should handle text overflow gracefully with ellipsis or nowrap
// Long exam titles could overflow cards otherwise

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} css-text-overflow-ellipsis.test.js\n');

var css = fs.readFileSync(path.join(__dirname, '../../shared/styles.css'), 'utf-8');

console.log('\u2500\u2500 Text overflow checks \u2500\u2500\n');

var hasTextOverflow = css.includes('text-overflow');
var hasEllipsis = css.includes('ellipsis');
var hasOverflowHidden = css.includes('overflow: hidden') || css.includes('overflow:hidden');
var hasWhiteNowrap = css.includes('white-space: nowrap') || css.includes('white-space:nowrap');

test('CSS defines text-overflow or overflow handling', hasTextOverflow || hasOverflowHidden || hasWhiteNowrap);
test('CSS uses ellipsis or overflow hidden for text clipping', hasEllipsis || hasOverflowHidden);

console.log('  text-overflow: ' + hasTextOverflow + ', ellipsis: ' + hasEllipsis);

console.log('\n' + '='.repeat(50));
console.log('css-text-overflow-ellipsis: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
