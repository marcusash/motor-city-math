// index-katex-not-loaded test
// index.html dashboard must NOT load KaTeX
// KaTeX is only needed in exam.html -- loading on dashboard wastes bandwidth

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} index-katex-not-loaded.test.js\n');

var indexSrc = fs.readFileSync(path.join(__dirname, '../../index.html'), 'utf-8');

console.log('\u2500\u2500 KaTeX not on dashboard checks \u2500\u2500\n');

var hasKatex = indexSrc.toLowerCase().includes('katex');
test('index.html does NOT load KaTeX (unnecessary on dashboard)', !hasKatex);

console.log('\n' + '='.repeat(50));
console.log('index-katex-not-loaded: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
