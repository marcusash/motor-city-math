// css-responsive-mobile-first test
// shared/styles.css must use mobile-first responsive design
// Mobile-first: base styles target small screens, media queries use min-width

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} css-responsive-mobile-first.test.js\n');

var stylesSrc = fs.readFileSync(path.join(__dirname, '../../shared/styles.css'), 'utf-8');

console.log('\u2500\u2500 Mobile-first responsive checks \u2500\u2500\n');

// 1. At least one min-width media query
var minWidthCount = (stylesSrc.match(/min-width/g) || []).length;
test('Uses min-width media queries (mobile-first): ' + minWidthCount, minWidthCount >= 1);

// 2. pointer:coarse media query for touch targets
var hasPointerCoarse = stylesSrc.includes('pointer: coarse') || stylesSrc.includes('pointer:coarse');
test('pointer:coarse media query for touch targets', hasPointerCoarse);

// 3. Breakpoint at or near 768px (tablet)
var has768 = stylesSrc.includes('768px');
test('768px tablet breakpoint defined', has768);

console.log('\n' + '='.repeat(50));
console.log('css-responsive-mobile-first: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
