// css-no-hardcoded-black-white test
// CSS should not use raw #000000 or #ffffff -- use tokens instead
// Hardcoded black/white breaks themed components (arena mode, print)

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} css-no-hardcoded-black-white.test.js\n');

var css = fs.readFileSync(path.join(__dirname, '../../shared/styles.css'), 'utf-8');

var black = (css.match(/#000000\b|#000\b(?![\da-fA-F])/g) || []).length;
var white = (css.match(/#ffffff\b|#fff\b(?![\da-fA-F])/gi) || []).length;
var MAX_EACH = 6;

test('Max ' + MAX_EACH + ' hardcoded #000000 values (' + black + ' found)', black <= MAX_EACH);
test('Max ' + MAX_EACH + ' hardcoded #ffffff values (' + white + ' found)', white <= MAX_EACH);

console.log('\n' + '='.repeat(50));
console.log('css-no-hardcoded-black-white: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
