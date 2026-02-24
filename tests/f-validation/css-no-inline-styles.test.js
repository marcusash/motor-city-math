// css-no-inline-styles test
// Check exam.html and index.html don't have excessive inline styles
// Some inline styles are OK but mass usage indicates CSS architecture failure

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} css-no-inline-styles.test.js\n');

var root = path.join(__dirname, '../..');
var MAX_INLINE = 30;

console.log('\u2500\u2500 Inline style count checks (max ' + MAX_INLINE + ' per file) \u2500\u2500\n');

['exam.html', 'index.html'].forEach(function(fname) {
    var html = fs.readFileSync(path.join(root, fname), 'utf-8');
    var count = (html.match(/\bstyle\s*=\s*["'][^"']{1,200}["']/g) || []).length;
    console.log('  ' + fname + ': ' + count + ' inline style attributes');
    test(fname + ' has <= ' + MAX_INLINE + ' inline styles (' + count + ' found)', count <= MAX_INLINE);
});

console.log('\n' + '='.repeat(50));
console.log('css-no-inline-styles: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
