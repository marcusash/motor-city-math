// shared-katex-css-present test
// KaTeX CSS must be loaded in the shared directory (local, not CDN)
// Math rendering fails without it

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} shared-katex-css-present.test.js\n');

var sharedDir = path.join(__dirname, '../../shared');
var katexCss = path.join(sharedDir, 'katex', 'katex.min.css');
var katexAlt  = path.join(sharedDir, 'katex.min.css');

var hasKatexCss = fs.existsSync(katexCss) || fs.existsSync(katexAlt);
// Also check for katex dir
var hasKatexDir = fs.existsSync(path.join(sharedDir, 'katex'));

test('shared/katex/ directory exists', hasKatexDir);
test('KaTeX CSS file is present in shared/', hasKatexCss || hasKatexDir);
if (!hasKatexCss && !hasKatexDir) console.log('    ! No KaTeX CSS found in shared/. Math will not render.');

console.log('\n' + '='.repeat(50));
console.log('shared-katex-css-present: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
