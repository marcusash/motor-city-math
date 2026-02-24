// css-box-sizing-border-box test
// CSS should set box-sizing: border-box globally
// Without it, padding increases element width and breaks responsive layouts

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} css-box-sizing-border-box.test.js\n');

var css = fs.readFileSync(path.join(__dirname, '../../shared/styles.css'), 'utf-8');

var hasBorderBox = /box-sizing\s*:\s*border-box/.test(css);

test('CSS defines box-sizing: border-box', hasBorderBox);

console.log('\n' + '='.repeat(50));
console.log('css-box-sizing-border-box: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
