// css-text-align-center-used test
// CSS should use text-align: center for buttons, headings, or centered UI
// Pure left-alignment for all elements results in an unbalanced layout

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} css-text-align-center-used.test.js\n');

var css = fs.readFileSync(path.join(__dirname, '../../shared/styles.css'), 'utf-8');

var hasTextAlignCenter = /text-align\s*:\s*center/.test(css);

test('CSS uses text-align: center somewhere', hasTextAlignCenter);

console.log('\n' + '='.repeat(50));
console.log('css-text-align-center-used: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
