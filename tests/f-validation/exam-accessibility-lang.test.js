// exam-accessibility-lang test
// exam.html must have lang="en" on <html> element (WCAG 3.1.1)
// Without lang attribute, screen readers can't set the right language

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} exam-accessibility-lang.test.js\n');

var files = {
    'exam.html': fs.readFileSync(require('path').join(__dirname, '../../exam.html'), 'utf-8'),
    'index.html': fs.readFileSync(require('path').join(__dirname, '../../index.html'), 'utf-8')
};

console.log('\u2500\u2500 lang attribute checks \u2500\u2500\n');

Object.keys(files).forEach(function(name) {
    var src = files[name];
    var hasLang = src.includes('lang="en"') || src.includes("lang='en'") || src.includes('lang="en-US"');
    test(name + ' has lang="en" on <html>', hasLang);
});

// Verify lang is on html element (not body or div)
var examSrc = files['exam.html'];
var langOnHtml = /<html[^>]*lang=/i.test(examSrc);
test('lang attribute is on <html> element (not body/div)', langOnHtml);

console.log('\n' + '='.repeat(50));
console.log('exam-accessibility-lang: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
