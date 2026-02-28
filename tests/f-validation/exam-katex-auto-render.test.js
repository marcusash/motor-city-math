// exam-katex-auto-render test
// exam.html should call renderMathInElement or katex.renderMathInElement
// for auto-rendering LaTeX in question HTML (not just manual katex.render calls)

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} exam-katex-auto-render.test.js\n');

var html = fs.readFileSync(path.join(__dirname, '../../exam.html'), 'utf-8');

console.log('\u2500\u2500 KaTeX auto-render checks \u2500\u2500\n');

var hasAutoRender = html.includes('renderMathInElement') || html.includes('auto-render');
var hasKatexLoad = html.includes('katex') || html.includes('KaTeX');

test('exam.html includes KaTeX library reference', hasKatexLoad);
test('exam.html calls renderMathInElement or includes auto-render', hasAutoRender);

console.log('\n' + '='.repeat(50));
console.log('exam-katex-auto-render: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
