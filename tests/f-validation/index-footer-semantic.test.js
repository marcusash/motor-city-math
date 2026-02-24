// index-footer-semantic test
// index.html must use a semantic <footer> element (not <div class="footer">)
// Semantic HTML is required for WCAG 2.4.1 (screen reader landmark nav)

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} index-footer-semantic.test.js\n');

var html = fs.readFileSync(path.join(__dirname, '../../index.html'), 'utf-8');

var hasSemanticFooter = /<footer[\s>]/i.test(html);
var hasNonSemanticFooter = /<div[^>]+class\s*=\s*["'][^"']*\bfooter\b[^"']*["']/i.test(html);

test('index.html uses semantic <footer> element', hasSemanticFooter);
test('index.html does not use <div class="footer"> (non-semantic)', !hasNonSemanticFooter);
if (hasNonSemanticFooter) console.log('    ! <div class="footer"> found. Replace with <footer>');

console.log('\n' + '='.repeat(50));
console.log('index-footer-semantic: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
