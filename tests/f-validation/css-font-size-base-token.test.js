// css-font-size-base-token test
// CSS should define a --text-base or --font-size-base token
// Without it, font sizes are scattered and don't scale consistently

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} css-font-size-base-token.test.js\n');

var css = fs.readFileSync(path.join(__dirname, '../../shared/styles.css'), 'utf-8');

var hasBaseToken = /--text-base|--font-size-base|--font-size-body|--base-font/.test(css);

test('CSS defines a base font-size custom property token', hasBaseToken);

console.log('\n' + '='.repeat(50));
console.log('css-font-size-base-token: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
