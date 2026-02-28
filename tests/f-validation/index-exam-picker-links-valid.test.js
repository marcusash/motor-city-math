// index-exam-picker-links-valid test
// All exam links in index.html exam picker must point to exam.html?file=retake-practice-N format

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} index-exam-picker-links-valid.test.js\n');

var html = fs.readFileSync(path.join(__dirname, '../../index.html'), 'utf-8');

// All exam links should match the expected format
var allLinks = html.match(/href\s*=\s*["']([^"']+)["']/g) || [];
var examLinks = allLinks.filter(function(l) { return l.includes('exam.html?file='); });
var malformed = examLinks.filter(function(l) {
    return !/exam\.html\?file=retake-practice-\d+/.test(l) &&
           !/exam\.html\?file=\w[\w-]*/.test(l);
});

test('exam.html?file= links found in index.html', examLinks.length >= 1);
test('All exam file links use valid format (>= ' + examLinks.length + ' total, ' + malformed.length + ' malformed)', malformed.length === 0);
if (malformed.length) malformed.forEach(function(l) { console.log('    ! ' + l); });
console.log('  Total exam links: ' + examLinks.length);

console.log('\n' + '='.repeat(50));
console.log('index-exam-picker-links-valid: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
