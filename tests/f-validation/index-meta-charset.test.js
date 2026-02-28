// index-meta-charset test
// index.html must have <meta charset="utf-8">
// Without charset, KaTeX and math symbols may render incorrectly

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} index-meta-charset.test.js\n');

var indexSrc = fs.readFileSync(path.join(__dirname, '../../index.html'), 'utf-8');
var examSrc  = fs.readFileSync(path.join(__dirname, '../../exam.html'), 'utf-8');

console.log('\u2500\u2500 charset meta tag checks \u2500\u2500\n');

// index.html has charset
var indexCharset = /charset=["']?utf-8["']?/i.test(indexSrc);
test('index.html has charset=utf-8', indexCharset);

// exam.html has charset
var examCharset = /charset=["']?utf-8["']?/i.test(examSrc);
test('exam.html has charset=utf-8', examCharset);

// Charset is in <head> (before first </head>)
var indexHead = indexSrc.slice(0, indexSrc.indexOf('</head>'));
var examHead  = examSrc.slice(0, examSrc.indexOf('</head>'));
test('index.html charset declared in <head>', /charset=/i.test(indexHead));
test('exam.html charset declared in <head>', /charset=/i.test(examHead));

console.log('\n' + '='.repeat(50));
console.log('index-meta-charset: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
