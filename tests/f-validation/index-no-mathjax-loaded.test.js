// index-no-mathjax-loaded test
// index.html must NOT load MathJax (was replaced by KaTeX)
// MathJax would conflict with existing math rendering and slow the page

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} index-no-mathjax-loaded.test.js\n');

var html = fs.readFileSync(path.join(__dirname, '../../index.html'), 'utf-8');

console.log('\u2500\u2500 MathJax absence checks \u2500\u2500\n');

var hasMathJax = html.includes('MathJax') || html.includes('mathjax');

test('index.html does not load MathJax (replaced by KaTeX)', !hasMathJax);

console.log('\n' + '='.repeat(50));
console.log('index-no-mathjax-loaded: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
