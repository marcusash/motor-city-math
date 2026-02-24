// exam-meta-charset test
// exam.html must declare charset=UTF-8
// Missing charset causes rendering errors for KaTeX math symbols and unicode

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} exam-meta-charset.test.js\n');

var examSrc = fs.readFileSync(path.join(__dirname, '../../exam.html'), 'utf-8');

console.log('\u2500\u2500 Meta charset checks \u2500\u2500\n');

var hasCharset = examSrc.toLowerCase().includes('charset=utf-8') || 
                 examSrc.toLowerCase().includes('charset="utf-8"');
test('exam.html declares charset=UTF-8', hasCharset);

var charsetNearTop = examSrc.toLowerCase().indexOf('charset') < 500;
test('charset declared in first 500 bytes of document', charsetNearTop);

console.log('\n' + '='.repeat(50));
console.log('exam-meta-charset: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
