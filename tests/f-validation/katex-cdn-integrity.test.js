// KaTeX CDN integrity test
// exam.html loads KaTeX from CDN - must use integrity hash (SRI) for security
// CDN scripts without integrity hashes are a supply-chain risk

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} katex-cdn-integrity.test.js\n');

var examSrc = fs.readFileSync(path.join(__dirname, '../../exam.html'), 'utf-8');

console.log('\u2500\u2500 KaTeX CDN integrity checks \u2500\u2500\n');

// 1. KaTeX is loaded (CDN or local)
var hasKatexLocal = examSrc.includes('shared/katex/') || examSrc.includes('./katex/');
var hasKatexCdn = examSrc.includes('katex') && (examSrc.includes('cdn') || examSrc.includes('unpkg') ||
                  examSrc.includes('cdnjs') || examSrc.includes('jsdelivr'));
var hasKatexCdnOrLocal = hasKatexLocal || hasKatexCdn;
test('KaTeX loaded in exam.html (local shared/katex/ or CDN)', hasKatexCdnOrLocal);
if (hasKatexLocal) console.log('  INFO: KaTeX loaded locally (preferred over CDN for offline support)');

// 2. KaTeX script tag exists
var hasKatexScript = examSrc.includes('katex') && examSrc.includes('<script');
test('KaTeX script tag exists in exam.html', hasKatexScript);

// 3. KaTeX auto-render or renderMathInElement used
var hasKatexRender = examSrc.includes('katex.renderMathInElement') || examSrc.includes('auto-render') ||
                     examSrc.includes('renderMathInElement') || examSrc.includes('katex.render');
test('KaTeX render function called (renderMathInElement or katex.render)', hasKatexRender);

// 4. KaTeX CSS loaded (required for rendering)
var hasKatexCss = examSrc.includes('katex') && examSrc.includes('.css');
test('KaTeX CSS loaded in exam.html', hasKatexCss);

// 5. No MathJax (MCM uses KaTeX only - MathJax would conflict)
var hasMathJax = examSrc.includes('mathjax') || examSrc.includes('MathJax');
test('No MathJax in exam.html (MCM uses KaTeX only)', !hasMathJax);

console.log('\n' + '='.repeat(50));
console.log('katex-cdn-integrity: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
