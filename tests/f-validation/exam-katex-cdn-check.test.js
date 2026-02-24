// exam-katex-cdn-check test
// exam.html must load KaTeX from a local or CDN source
// Math rendering requires KaTeX to be loaded before questions render

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} exam-katex-cdn-check.test.js\n');

var examSrc = fs.readFileSync(path.join(__dirname, '../../exam.html'), 'utf-8');

console.log('\u2500\u2500 KaTeX loading checks \u2500\u2500\n');

// 1. KaTeX script loaded
var hasKatex = examSrc.toLowerCase().includes('katex');
test('KaTeX script referenced in exam.html', hasKatex);

// 2. KaTeX CSS loaded (required for rendering)
var hasKatexCss = examSrc.includes('katex.min.css') || examSrc.includes('katex.css');
test('KaTeX CSS loaded in exam.html', hasKatexCss);

// 3. renderMathInElement or katex.render called
var hasRender = examSrc.includes('renderMathInElement') || examSrc.includes('katex.render');
test('KaTeX render function called in exam.html', hasRender);

console.log('\n' + '='.repeat(50));
console.log('exam-katex-cdn-check: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
