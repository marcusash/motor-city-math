// exam-char-encoding test
// exam.html must declare UTF-8 charset in meta tag
// Required for proper KaTeX math rendering and unicode character support

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} exam-char-encoding.test.js\n');

var examSrc = fs.readFileSync(path.join(__dirname, '../../exam.html'), 'utf-8');
var indexSrc = fs.readFileSync(path.join(__dirname, '../../index.html'), 'utf-8');

console.log('\u2500\u2500 Character encoding checks \u2500\u2500\n');

// 1. charset=utf-8 in exam.html
var examHasUtf8 = examSrc.includes('charset="utf-8"') || examSrc.includes("charset='utf-8'") ||
                  examSrc.includes('charset=utf-8') || examSrc.toLowerCase().includes('charset="utf-8"');
test('exam.html declares charset=utf-8', examHasUtf8);

// 2. charset=utf-8 in index.html
var indexHasUtf8 = indexSrc.includes('charset="utf-8"') || indexSrc.includes("charset='utf-8'") ||
                   indexSrc.toLowerCase().includes('charset="utf-8"');
test('index.html declares charset=utf-8', indexHasUtf8);

// 3. charset meta appears early (within first 500 chars)
var charsetPos = examSrc.toLowerCase().indexOf('charset');
test('charset declaration appears early in exam.html (<500 chars)', charsetPos > 0 && charsetPos < 500);

console.log('\n' + '='.repeat(50));
console.log('exam-char-encoding: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
