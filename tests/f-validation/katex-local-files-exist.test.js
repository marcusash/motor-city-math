// shared/katex files exist test
// KaTeX is served locally from shared/katex/ 
// All required KaTeX files must exist for offline support

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} katex-local-files-exist.test.js\n');

var katexDir = path.join(__dirname, '../../shared/katex');

console.log('\u2500\u2500 KaTeX local file existence \u2500\u2500\n');

// 1. katex directory exists
var hasKatexDir = fs.existsSync(katexDir);
test('shared/katex/ directory exists', hasKatexDir);

if (hasKatexDir) {
    // 2. katex.min.js exists
    var hasKatexJs = fs.existsSync(path.join(katexDir, 'katex.min.js'));
    test('shared/katex/katex.min.js exists', hasKatexJs);

    // 3. katex.min.css exists
    var hasKatexCss = fs.existsSync(path.join(katexDir, 'katex.min.css'));
    test('shared/katex/katex.min.css exists', hasKatexCss);

    // 4. auto-render extension exists (for renderMathInElement)
    var hasAutoRender = fs.existsSync(path.join(katexDir, 'auto-render.min.js'));
    test('shared/katex/auto-render.min.js exists', hasAutoRender);

    // 5. fonts directory exists (KaTeX requires fonts for rendering)
    var hasFonts = fs.existsSync(path.join(katexDir, 'fonts')) || 
                   fs.existsSync(path.join(katexDir, 'fonts', 'KaTeX_Math-Italic.woff2'));
    test('shared/katex/fonts/ directory exists (KaTeX math fonts)', hasFonts);
} else {
    // Skip remaining tests if dir missing
    test('shared/katex/katex.min.js exists', false);
    test('shared/katex/katex.min.css exists', false);
    test('shared/katex/auto-render.min.js exists', false);
    test('shared/katex/fonts/ directory exists', false);
}

console.log('\n' + '='.repeat(50));
console.log('katex-local-files-exist: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
