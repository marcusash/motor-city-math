// exam-no-inner-html-xss test
// exam.html must not inject user-provided data into innerHTML without sanitization
// Unsanitized innerHTML injection is an XSS vulnerability

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} exam-no-inner-html-xss.test.js\n');

var html = fs.readFileSync(path.join(__dirname, '../../exam.html'), 'utf-8');

// Look for innerHTML assignments using URL params or user input
// These patterns indicate potential XSS: .innerHTML = ... + location. or params.get
var riskyPatterns = [
    /innerHTML\s*=\s*[^;]*location\./,
    /innerHTML\s*=\s*[^;]*params\.get/,
    /innerHTML\s*=\s*[^;]*searchParams\.get/,
    /innerHTML\s*=\s*[^;]*document\.URL/,
];
var xssRisks = riskyPatterns.filter(function(p) { return p.test(html); });

test('No high-risk innerHTML injections from URL params (' + xssRisks.length + ' patterns found)', xssRisks.length === 0);
if (xssRisks.length) console.log('    ! innerHTML injection from URL params detected -- sanitize input');

console.log('\n' + '='.repeat(50));
console.log('exam-no-inner-html-xss: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
