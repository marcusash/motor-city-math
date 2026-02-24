// css-no-vw-on-font-size test
// Font sizes must not use vw units directly without clamp()
// Bare vw font sizes scale uncontrollably and fail WCAG 1.4.4 (Resize Text)

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} css-no-vw-on-font-size.test.js\n');

var css = fs.readFileSync(path.join(__dirname, '../../shared/styles.css'), 'utf-8');

// Match font-size: NNvw (not inside clamp())
var fontSizeVw = css.match(/font-size\s*:\s*[\d.]+vw(?!\s*\))/g) || [];

test('CSS does not use bare vw units for font-size (' + fontSizeVw.length + ' violations)', fontSizeVw.length === 0);
if (fontSizeVw.length) {
    fontSizeVw.forEach(function(v) { console.log('    ! ' + v + ' -- use clamp() instead'); });
}

console.log('\n' + '='.repeat(50));
console.log('css-no-vw-on-font-size: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
