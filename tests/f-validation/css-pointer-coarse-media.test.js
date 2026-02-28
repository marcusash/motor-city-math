// css-pointer-coarse-media test
// shared/styles.css must have @media (pointer:coarse) rules for touch device support
// Kai may use a tablet or phone -- touch targets must be at least 44x44px

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} css-pointer-coarse-media.test.js\n');

var css = fs.readFileSync(path.join(__dirname, '../../shared/styles.css'), 'utf-8');

var hasPointerCoarse = /@media\s*\(\s*pointer\s*:\s*coarse\s*\)/.test(css);
// Must adjust sizes inside
var adjustsSize = /@media\s*\(\s*pointer\s*:\s*coarse\s*\)[\s\S]{0,400}(min-height|min-width|padding|font-size)/i.test(css);

test('@media (pointer:coarse) block is present', hasPointerCoarse);
test('pointer:coarse block adjusts element sizes', adjustsSize);

console.log('\n' + '='.repeat(50));
console.log('css-pointer-coarse-media: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
