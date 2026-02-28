// index-no-empty-href test
// Anchor tags in index.html must not have empty href="" or href="#" only
// Empty hrefs cause keyboard users to hit dead links (a11y)

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} index-no-empty-href.test.js\n');

var html = fs.readFileSync(path.join(__dirname, '../../index.html'), 'utf-8');

// match href="" or href="#" (exact hash only, not #section links)
var emptyHrefs = (html.match(/href\s*=\s*["']#?["']/g) || []).filter(function(h) {
    return h === 'href=""' || h === "href=''" || h === 'href="#"' || h === "href='#'";
});

test('No empty href="" or href="#" in index.html (' + emptyHrefs.length + ' found)', emptyHrefs.length === 0);
if (emptyHrefs.length) emptyHrefs.forEach(function(v) { console.log('    ! ' + v); });

console.log('\n' + '='.repeat(50));
console.log('index-no-empty-href: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
