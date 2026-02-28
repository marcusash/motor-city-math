// css-letter-spacing-defined test
// CSS design system should define letter-spacing for headings or branded text
// Tight letter-spacing improves readability in headings

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} css-letter-spacing-defined.test.js\n');

var css = fs.readFileSync(path.join(__dirname, '../../shared/styles.css'), 'utf-8');

var hasLetterSpacing = /letter-spacing/.test(css);

test('CSS defines letter-spacing somewhere', hasLetterSpacing);

console.log('\n' + '='.repeat(50));
console.log('css-letter-spacing-defined: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
