// exam-mathjax-not-used test
// MCM migrated from MathJax to KaTeX. No exam file should reference MathJax CDN or API.

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} exam-mathjax-not-used.test.js\n');

var examSrc = fs.readFileSync(path.join(__dirname, '../../exam.html'), 'utf-8');
var indexSrc = fs.readFileSync(path.join(__dirname, '../../index.html'), 'utf-8');
var sharedSrc = fs.readFileSync(path.join(__dirname, '../../shared/scripts.js'), 'utf-8');
var stylesSrc = fs.readFileSync(path.join(__dirname, '../../shared/styles.css'), 'utf-8');

console.log('\u2500\u2500 MathJax removal checks \u2500\u2500\n');

// 1. No MathJax CDN reference in exam.html
var examHasMathJax = examSrc.includes('mathjax') || examSrc.includes('MathJax');
test('exam.html does not reference MathJax', !examHasMathJax);

// 2. No MathJax in index.html
var indexHasMathJax = indexSrc.includes('mathjax') || indexSrc.includes('MathJax');
test('index.html does not reference MathJax', !indexHasMathJax);

// 3. KaTeX is used instead
var examHasKaTeX = examSrc.includes('katex') || examSrc.includes('KaTeX') || examSrc.includes('renderMathInElement');
test('exam.html uses KaTeX', examHasKaTeX);

// 4. No mathjax in shared files
var sharedHasMathJax = sharedSrc.includes('mathjax') || stylesSrc.includes('mathjax');
test('shared/scripts.js and styles.css do not reference MathJax', !sharedHasMathJax);

console.log('\n' + '='.repeat(50));
console.log('exam-mathjax-not-used: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
