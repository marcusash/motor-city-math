// css-mobile-breakpoint test
// styles.css must define the 768px mobile breakpoint
// Per .responsive-spec.md: 768px is the primary breakpoint for MCM

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} css-mobile-breakpoint.test.js\n');

var cssSrc = fs.readFileSync(path.join(__dirname, '../../shared/styles.css'), 'utf-8');

console.log('\u2500\u2500 Mobile breakpoint checks \u2500\u2500\n');

// 768px breakpoint defined
var has768 = cssSrc.includes('768px');
test('768px breakpoint defined in styles.css', has768);

// @media query for mobile
var hasMobileQuery = cssSrc.includes('@media') && (cssSrc.includes('max-width') || cssSrc.includes('min-width'));
test('@media query with max-width or min-width defined', hasMobileQuery);

// Touch target media query (pointer:coarse)
var hasPointerCoarse = cssSrc.includes('pointer: coarse') || cssSrc.includes('pointer:coarse');
test('pointer:coarse media query for touch targets defined', hasPointerCoarse);

console.log('\n' + '='.repeat(50));
console.log('css-mobile-breakpoint: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
