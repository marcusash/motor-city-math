// css-text-color-token test
// CSS should define a --text-primary token for the main text color
// Hardcoded text colors make it impossible to support dark/light themes

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} css-text-color-token.test.js\n');

var css = fs.readFileSync(path.join(__dirname, '../../shared/styles.css'), 'utf-8');

var hasTextToken = /--text-primary|--text-default|--color-text|--fg-primary/.test(css);

test('CSS defines a text color custom property token', hasTextToken);

console.log('\n' + '='.repeat(50));
console.log('css-text-color-token: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
