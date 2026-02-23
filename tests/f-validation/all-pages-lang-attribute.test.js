// HTML lang attribute on all pages test
// WCAG 3.1.1: page must have lang attribute on <html>
// All MCM HTML files must have <html lang="en">

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} all-pages-lang-attribute.test.js\n');

var root = path.join(__dirname, '../../');
var htmlFiles = [
    'exam.html',
    'index.html',
    'final_exam_251123.html',
    'final_exam_251123_mini.html',
    'nonlinear_exam_mvp.html',
];

console.log('\u2500\u2500 HTML lang="en" attribute checks \u2500\u2500\n');

var missing = [];
htmlFiles.forEach(function(f) {
    var fpath = path.join(root, f);
    if (!fs.existsSync(fpath)) {
        console.log('  SKIP: ' + f + ' (does not exist)');
        return;
    }
    var src = fs.readFileSync(fpath, 'utf-8');
    var hasLang = src.includes('<html lang="en"') || src.includes("<html lang='en'");
    if (!hasLang) missing.push(f);
    console.log('  ' + (hasLang ? '\u2705' : '\u274c') + ' ' + f);
});

test('All HTML pages have <html lang="en">', missing.length === 0);

if (missing.length) {
    missing.forEach(function(f) { console.log('  ! Missing lang: ' + f); });
}

console.log('\n' + '='.repeat(50));
console.log('all-pages-lang-attribute: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
