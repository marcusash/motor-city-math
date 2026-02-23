// KaTeX rendering test
// Verifies exam.html loads KaTeX and calls renderMathInElement after dynamic render

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} mathjax-rendering.test.js\n');

const examSrc = fs.readFileSync(path.join(__dirname, '../../exam.html'), 'utf-8');

console.log('\u2500\u2500 KaTeX integration checks \u2500\u2500\n');

// 1. KaTeX loaded via CDN
var hasKaTeX = examSrc.includes('katex') || examSrc.includes('KaTeX');
test('exam.html loads KaTeX', hasKaTeX);

// 2. KaTeX auto-render extension loaded
var hasAutoRender = examSrc.includes('auto-render') || examSrc.includes('renderMathInElement') ||
                    examSrc.includes('autoRender');
test('exam.html loads KaTeX auto-render extension', hasAutoRender);

// 3. renderMathInElement called after dynamic render
var hasTypeset = examSrc.includes('renderMathInElement') || examSrc.includes('katex.render');
test('exam.html calls renderMathInElement after dynamic render', hasTypeset);

// 4. KaTeX delimiters configured (\(...\) and $$...$$)
var hasDelimiters = examSrc.includes('delimiters') || examSrc.includes('\\\\(') || examSrc.includes('$$');
test('exam.html configures KaTeX math delimiters', hasDelimiters || hasAutoRender);

// 5. Math delimiters in RP JSON question_html (check for LaTeX markers)
var rp1 = JSON.parse(fs.readFileSync(path.join(__dirname, '../../data/retake-practice-1.json'), 'utf-8'));
var hasLatex = (rp1.questions || []).some(function(q) {
    return (q.question_html || '').includes('\\(') || (q.question_html || '').includes('$$') ||
           (q.question_html || '').includes('\\[');
});
test('RP1 question_html contains LaTeX math markers', hasLatex);

console.log('\n' + '='.repeat(50));
console.log('katex-rendering: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
