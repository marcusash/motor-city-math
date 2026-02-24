// exam-html-lang-en test
// exam.html and index.html must have lang="en" on <html> element (WCAG 3.1.1)

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} exam-html-lang-en.test.js\n');

var root = path.join(__dirname, '../..');
var files = ['exam.html', 'index.html'];

console.log('\u2500\u2500 lang="en" checks \u2500\u2500\n');

files.forEach(function(fname) {
    var html = fs.readFileSync(path.join(root, fname), 'utf-8');
    var hasLangEn = /<html[^>]+lang\s*=\s*["']en["']/i.test(html);
    test(fname + ' has lang="en" on <html>', hasLangEn);
});

console.log('\n' + '='.repeat(50));
console.log('exam-html-lang-en: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
