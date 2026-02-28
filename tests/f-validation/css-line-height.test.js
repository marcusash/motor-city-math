// CSS line-height test
// Text content must have adequate line-height for readability (WCAG 1.4.8)
// MCM uses math content -- tight line-height makes fractions and exponents hard to read

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} css-line-height.test.js\n');

var cssSrc = fs.readFileSync(path.join(__dirname, '../../shared/styles.css'), 'utf-8');

console.log('\u2500\u2500 Line-height checks \u2500\u2500\n');

// 1. line-height defined somewhere
var hasLineHeight = cssSrc.includes('line-height');
test('line-height defined in shared/styles.css', hasLineHeight);

// 2. Body or base line-height >= 1.5 (WCAG 1.4.12)
var lineHeightValues = cssSrc.match(/line-height:\s*([0-9.]+)/g) || [];
var adequateValues = lineHeightValues.filter(function(v) {
    var val = parseFloat(v.match(/([0-9.]+)/)[1]);
    return val >= 1.5;
});
console.log('  line-height declarations: ' + lineHeightValues.length + ', adequate (>=1.5): ' + adequateValues.length);
test('At least 1 line-height >= 1.5 defined (WCAG 1.4.12 readability)', adequateValues.length >= 1);

// 3. No line-height < 1 (would collapse lines)
var tightValues = lineHeightValues.filter(function(v) {
    var val = parseFloat(v.match(/([0-9.]+)/)[1]);
    return val > 0 && val < 1;
});
if (tightValues.length) tightValues.forEach(function(v) { console.log('  ! Tight: ' + v); });
test('No line-height values < 1 (would collapse text)', tightValues.length === 0);

console.log('\n' + '='.repeat(50));
console.log('css-line-height: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
