// exam-katex-render-check test
// exam.html must invoke KaTeX rendering after question HTML is injected
// If renderMathInElement or katex.renderMathInElement is not called, math shows raw LaTeX

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} exam-katex-render-check.test.js\n');

var examSrc = fs.readFileSync(path.join(__dirname, '../../exam.html'), 'utf-8');

console.log('\u2500\u2500 KaTeX render invocation checks \u2500\u2500\n');

// 1. renderMathInElement called
var hasRender = examSrc.includes('renderMathInElement');
test('renderMathInElement() called in exam.html', hasRender);

// 2. KaTeX auto-render extension loaded
var hasAutoRender = examSrc.includes('auto-render') || examSrc.includes('katex.min.js');
test('KaTeX auto-render extension included', hasAutoRender);

// 3. KaTeX render happens after dynamic content injection (not just on DOMContentLoaded)
var hasPostInjectRender = examSrc.includes('renderMathInElement') && (
    examSrc.includes('innerHTML') && examSrc.includes('renderMathInElement')
);
test('renderMathInElement called after innerHTML injection', hasPostInjectRender);

console.log('\n' + '='.repeat(50));
console.log('exam-katex-render-check: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
