// exam-html-no-inline-style-important test
// exam.html should not use !important in inline style attributes
// !important overrides are a CSS smell that makes theming and a11y fixes difficult

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} exam-no-inline-important.test.js\n');

var examSrc = fs.readFileSync(path.join(__dirname, '../../exam.html'), 'utf-8');

console.log('\u2500\u2500 Inline !important checks \u2500\u2500\n');

// Find inline style="...!important..." patterns
var inlineImportant = (examSrc.match(/style="[^"]*!important[^"]*"/g) || []);
if (inlineImportant.length) inlineImportant.slice(0, 3).forEach(function(v) {
    console.log('  ! Inline !important: ' + v.substring(0, 80));
});

test('No inline style !important in exam.html (' + inlineImportant.length + ' found)', inlineImportant.length === 0);

// Check CSS !important count in inline <style> tags (allow reasonable amount)
var styleBlocks = examSrc.match(/<style[\s\S]*?<\/style>/gi) || [];
var cssImportantCount = 0;
styleBlocks.forEach(function(block) {
    cssImportantCount += (block.match(/!important/g) || []).length;
});
test('Inline <style> !important usage reasonable (<20): ' + cssImportantCount + ' found', cssImportantCount < 20);

console.log('\n' + '='.repeat(50));
console.log('exam-no-inline-important: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
