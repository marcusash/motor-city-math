// css-button-border-radius test
// Buttons should have border-radius for a modern, rounded appearance
// Square buttons feel outdated and harder to click on touch screens

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} css-button-border-radius.test.js\n');

var css = fs.readFileSync(path.join(__dirname, '../../shared/styles.css'), 'utf-8');

// Buttons or .btn classes should have border-radius
var hasBorderRadius = /button[^{]*\{[^}]*border-radius|\.btn[^{]*\{[^}]*border-radius|--border-radius[^;]*;/s.test(css);
// Or a border-radius token
var hasToken = /--border-radius/.test(css) || /--radius/.test(css);

test('CSS defines border-radius for buttons', hasBorderRadius || hasToken);

console.log('\n' + '='.repeat(50));
console.log('css-button-border-radius: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
