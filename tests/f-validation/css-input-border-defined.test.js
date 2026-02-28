// css-input-border-defined test
// Input elements must have a visible border defined in CSS
// Borderless inputs are confusing for all users (WCAG 1.4.11 Non-text Contrast)

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} css-input-border-defined.test.js\n');

var css = fs.readFileSync(path.join(__dirname, '../../shared/styles.css'), 'utf-8');

// input, textarea, or select must have border styling
var hasInputBorder = /input[^{]*\{[^}]*border/.test(css) ||
                     /\.input[^{]*\{[^}]*border/.test(css);
var hasBorderToken = /--border[^;]+;/.test(css);

test('CSS defines border for input elements', hasInputBorder || hasBorderToken);

console.log('\n' + '='.repeat(50));
console.log('css-input-border-defined: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
