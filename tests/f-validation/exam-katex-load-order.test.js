// exam-katex-loaded-before-use test
// KaTeX script must be loaded before renderMathInElement is called
// If KaTeX is loaded after use, math rendering silently fails

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} exam-katex-load-order.test.js\n');

var examSrc = fs.readFileSync(path.join(__dirname, '../../exam.html'), 'utf-8');

console.log('\u2500\u2500 KaTeX load order checks \u2500\u2500\n');

// KaTeX script loaded
var katexScriptIdx = examSrc.indexOf('katex');
var renderMathIdx = examSrc.indexOf('renderMathInElement');

test('KaTeX script tag present in exam.html', katexScriptIdx !== -1);
test('renderMathInElement call present in exam.html', renderMathIdx !== -1);

// KaTeX loaded before renderMathInElement is called
if (katexScriptIdx !== -1 && renderMathIdx !== -1) {
    test('KaTeX script appears before renderMathInElement call', katexScriptIdx < renderMathIdx);
} else {
    test('Cannot verify load order (KaTeX or renderMathInElement missing)', false);
}

console.log('\n' + '='.repeat(50));
console.log('exam-katex-load-order: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
