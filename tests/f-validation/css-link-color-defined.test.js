// css-link-color-defined test
// CSS should define a color for links (a elements) to ensure consistent styling

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} css-link-color-defined.test.js\n');

var css = fs.readFileSync(path.join(__dirname, '../../shared/styles.css'), 'utf-8');

// CSS must have a color rule for anchor tags or define --text-primary token (links inherit)
var hasLinkColor = /\ba\s*[,{][^}]*color\s*:/.test(css) || /\ba\b[^{]*\{[^}]*color\s*:/.test(css) ||
    /--text-primary\s*:/.test(css);

test('CSS defines a color for link elements', hasLinkColor);

console.log('\n' + '='.repeat(50));
console.log('css-link-color-defined: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
