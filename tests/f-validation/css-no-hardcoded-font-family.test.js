// css-no-hardcoded-font-family test
// Font families should use CSS custom properties or be defined in :root
// Hardcoded font strings scattered in CSS create maintenance issues

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} css-no-hardcoded-font-family.test.js\n');

var css = fs.readFileSync(path.join(__dirname, '../../shared/styles.css'), 'utf-8');

// Count font-family declarations that don't reference a CSS variable
var fontFamilyLines = (css.match(/font-family\s*:[^;]+;/g) || []);
var hardcoded = fontFamilyLines.filter(function(line) {
    return !/var\(--/.test(line);
});

var MAX_HARDCODED = 8; // allow KaTeX, inherit, mono stack
test('CSS has <= ' + MAX_HARDCODED + ' hardcoded font-family values (' + hardcoded.length + ' found)', hardcoded.length <= MAX_HARDCODED);
if (hardcoded.length > MAX_HARDCODED) {
    hardcoded.forEach(function(v) { console.log('    ! ' + v.trim()); });
}

console.log('\n' + '='.repeat(50));
console.log('css-no-hardcoded-font-family: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
