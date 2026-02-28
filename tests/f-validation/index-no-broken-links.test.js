// index-no-broken-links test
// index.html must not reference non-existent local files
// Broken links cause 404s when Kai tries to open a practice exam

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} index-no-broken-links.test.js\n');

var indexSrc = fs.readFileSync(path.join(__dirname, '../../index.html'), 'utf-8');
var root = path.join(__dirname, '../..');

// Extract local src/href references (not CDN)
var refs = [];
var srcMatches = indexSrc.match(/src="([^"]+)"/g) || [];
var hrefMatches = indexSrc.match(/href="([^"]+)"/g) || [];

[...srcMatches, ...hrefMatches].forEach(function(m) {
    var url = m.replace(/^(src|href)="/, '').replace(/"$/, '');
    // Skip external URLs, anchors, javascript:, data:, template literals
    if (url.startsWith('http') || url.startsWith('#') || 
        url.startsWith('javascript') || url.startsWith('data:') ||
        url.includes("'") || url.includes('+')) return;
    // Skip URLs with query params (dynamic)
    if (url.includes('?')) return;
    refs.push(url);
});

console.log('\u2500\u2500 Local file existence checks \u2500\u2500\n');

var broken = [];
refs.forEach(function(ref) {
    var fp = path.join(root, ref);
    if (!fs.existsSync(fp)) {
        broken.push(ref + ' -> NOT FOUND');
        console.log('  ! ' + ref);
    }
});

test('All ' + refs.length + ' local file references exist on disk', broken.length === 0);

console.log('\n' + '='.repeat(50));
console.log('index-no-broken-links: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
