// html[lang] attribute test
// WCAG 3.1.1: All HTML files must have lang attribute on <html> element

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} html-lang-attribute.test.js\n');

const htmlFiles = [
    'exam.html',
    'index.html',
    'final_exam_251123.html',
    'nonlinear_exam_mvp.html',
    'final_exam_251123_mini.html'
];

var root = path.join(__dirname, '../../');

console.log('\u2500\u2500 Checking html[lang] on ' + htmlFiles.length + ' files \u2500\u2500\n');

var missingLang = [];
var wrongLang = [];

htmlFiles.forEach(function(file) {
    var src = fs.readFileSync(path.join(root, file), 'utf-8');
    var htmlTag = src.match(/<html[^>]*>/);
    if (!htmlTag) {
        console.log('  \u274c ' + file + ': no <html> tag found');
        missingLang.push(file);
        return;
    }
    var tag = htmlTag[0];
    var langMatch = tag.match(/lang="([^"]+)"/);
    if (!langMatch) {
        console.log('  \u274c ' + file + ': <html> has no lang attribute (' + tag + ')');
        missingLang.push(file);
    } else if (langMatch[1] !== 'en') {
        console.log('  \u26a0 ' + file + ': lang="' + langMatch[1] + '" (expected "en")');
        wrongLang.push(file + '(lang=' + langMatch[1] + ')');
    } else {
        console.log('  \u2705 ' + file + ': lang="en"');
    }
});

console.log('');
test('All HTML files have lang attribute', missingLang.length === 0);
test('All HTML files use lang="en"', wrongLang.length === 0);

console.log('\n' + '='.repeat(50));
console.log('html-lang-attribute: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
