// css-no-float-layout test
// CSS must not use floats for layout -- flexbox/grid are the standard
// Floats cause clearfix hacks and layout bugs on mobile

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} css-no-float-layout.test.js\n');

var css = fs.readFileSync(path.join(__dirname, '../../shared/styles.css'), 'utf-8');

// float:left or float:right (not float:none which is OK)
var floatLayoutCount = (css.match(/float\s*:\s*(left|right)/g) || []).length;

test('CSS has 0 float:left/right layout rules (actual: ' + floatLayoutCount + ')', floatLayoutCount === 0);
if (floatLayoutCount > 0) console.log('    ! ' + floatLayoutCount + ' float rules found. Use flexbox or grid instead.');

console.log('\n' + '='.repeat(50));
console.log('css-no-float-layout: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
