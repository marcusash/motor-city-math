// index-back-to-top test
// index.html should have a way to navigate back up (header link or scroll target)
// For mobile ADHD users who scroll past a long list

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} index-back-to-top.test.js\n');

var f = path.join(__dirname, '../../index.html');
var html = fs.readFileSync(f, 'utf-8');

console.log('\u2500\u2500 Navigation checks for index.html \u2500\u2500\n');

// Check for id on header/hero or a skip link -- allows anchor link nav
var hasAnchorTarget = /id\s*=\s*["']top["']/.test(html) || /id\s*=\s*["']hero["']/.test(html) || /<header[^>]*id/.test(html);
var hasNavAnchors = /<a[^>]+href\s*=\s*["']#/.test(html);
// Alternative: just has header landmark (already tested in index-aria-main-landmark)
var hasHeader = /<header[\s>]/.test(html);

test('index.html has header landmark for navigation', hasHeader);
test('index.html has anchor-based navigation or id targets', hasAnchorTarget || hasNavAnchors);

console.log('\n' + '='.repeat(50));
console.log('index-back-to-top: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
