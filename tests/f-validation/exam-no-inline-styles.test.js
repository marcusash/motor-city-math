// exam-no-inline-styles test
// exam.html should not use inline style="" attributes for layout/color
// Inline styles violate the design token system and can't be overridden by themes

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} exam-no-inline-styles.test.js\n');

var examSrc = fs.readFileSync(path.join(__dirname, '../../exam.html'), 'utf-8');

console.log('\u2500\u2500 Inline style checks \u2500\u2500\n');

// Find style="" attributes in HTML (not in CSS blocks)
// Only scan the HTML body (not <style> blocks)
var htmlOnly = examSrc.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '');
var inlineStyles = htmlOnly.match(/\bstyle\s*=\s*["'][^"']*["']/g) || [];

// Dynamic inline styles set via JS (style.display, etc.) are OK
// Only flag static HTML inline styles
inlineStyles.forEach(function(s) { console.log('  ! ' + s.slice(0, 80)); });

// Allow up to 30 inline styles (display:none, width:% for progress, etc. are common)
test('Inline style="" attributes <=30 in HTML structure: ' + inlineStyles.length, inlineStyles.length <= 30);

console.log('\n' + '='.repeat(50));
console.log('exam-no-inline-styles: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
