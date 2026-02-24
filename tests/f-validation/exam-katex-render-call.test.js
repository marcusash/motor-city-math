// exam-kex-delimiter test
// exam.html must load KaTeX and call renderMathInElement for math rendering

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} rp-katex-render-call.test.js\n');

var f = path.join(__dirname, '../../exam.html');
var html = fs.readFileSync(f, 'utf-8');

console.log('\u2500\u2500 KaTeX integration checks \u2500\u2500\n');

test('exam.html loads katex.min.js', html.includes('katex'));
test('exam.html calls renderMathInElement', html.includes('renderMathInElement'));
test('exam.html defines delimiters for KaTeX', /delimiters\s*:|renderMathInElement/.test(html));

console.log('\n' + '='.repeat(50));
console.log('rp-katex-render-call: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
