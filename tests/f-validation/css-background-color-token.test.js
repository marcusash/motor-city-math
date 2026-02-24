// css-background-color-token test
// CSS should define a --bg-primary or --background token for the main background
// Hardcoded background colors break dark mode / arena mode theming

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} css-background-color-token.test.js\n');

var css = fs.readFileSync(path.join(__dirname, '../../shared/styles.css'), 'utf-8');

var hasBgToken = /--bg-primary|--bg-default|--bg-base|--background\b|--bg-page|--bg-card/.test(css);

test('CSS defines a background color custom property token', hasBgToken);

console.log('\n' + '='.repeat(50));
console.log('css-background-color-token: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
