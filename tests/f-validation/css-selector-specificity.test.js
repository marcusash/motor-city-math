// css-selector-specificity test
// CSS should not use excessive specificity (no !important in more than 15 spots)
// and should not use deeply nested selectors > 4 levels

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} css-selector-specificity.test.js\n');

var css = fs.readFileSync(path.join(__dirname, '../../shared/styles.css'), 'utf-8');

console.log('\u2500\u2500 CSS specificity audit checks \u2500\u2500\n');

var importantCount = (css.match(/!important/g) || []).length;
// Check for selectors with 4+ levels of nesting (approximation: 4+ spaces/element combos)
var deepNesting = (css.match(/\w[\w-]*\s+[\w#.:\[]\w+\s+[\w#.:\[]\w+\s+[\w#.:\[]\w+\s+[\w#.:\[]/g) || []).length;

test('CSS has <= 15 !important declarations (' + importantCount + ' found)', importantCount <= 15);
test('CSS has minimal deeply-nested selectors (<= 15)', deepNesting <= 15);

console.log('  !important count: ' + importantCount + ', deep nesting count: ' + deepNesting);

console.log('\n' + '='.repeat(50));
console.log('css-selector-specificity: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
