// exam-local-assets-only test
// exam.html should load all assets from local files, not external CDNs
// CDN failures = broken KaTeX/CSS for Kai even offline (GitHub Pages)

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} exam-local-assets-only.test.js\n');

var examSrc = fs.readFileSync(path.join(__dirname, '../../exam.html'), 'utf-8');

console.log('\u2500\u2500 CDN asset checks \u2500\u2500\n');

// Extract all src/href values from script and link tags
var externalUrls = [];
var srcRe = /(?:src|href)\s*=\s*["'](https?:\/\/[^"']+)["']/g;
var m;
while ((m = srcRe.exec(examSrc)) !== null) {
    externalUrls.push(m[1]);
}

// Known acceptable external: fonts.googleapis.com (font), unpkg.com (fallback only)
// Red flag: loading main JS/CSS from CDN without local fallback
var cdnJsCss = externalUrls.filter(function(url) {
    return (url.includes('.js') || url.includes('.css')) &&
           !url.includes('fonts.googleapis') &&
           !url.includes('fonts.gstatic');
});

if (cdnJsCss.length) {
    cdnJsCss.forEach(function(u) { console.log('  ! CDN dependency: ' + u); });
}

test('No external CDN JS/CSS dependencies in exam.html', cdnJsCss.length === 0);

console.log('\n' + '='.repeat(50));
console.log('exam-local-assets-only: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
