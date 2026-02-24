// rp-no-html-in-hint test
// Hints should be plain text, not HTML (exam.html renders hints as textContent)

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} rp-no-html-in-hint.test.js\n');

var dataDir = path.join(__dirname, '../../data');
var violations = [];
var total = 0;
var HTML_TAG = /<[a-zA-Z][^>]*>/;

for (var i = 1; i <= 11; i++) {
    var f = path.join(dataDir, 'retake-practice-' + i + '.json');
    if (!fs.existsSync(f)) continue;
    var rp = JSON.parse(fs.readFileSync(f, 'utf-8'));
    (rp.questions || []).forEach(function(q) {
        if (typeof q.hint !== 'string') return;
        total++;
        if (HTML_TAG.test(q.hint)) {
            violations.push('rp' + i + ' ' + q.id + ': "' + q.hint.slice(0, 60) + '"');
        }
    });
}

console.log('\u2500\u2500 Hint HTML-free checks \u2500\u2500\n');
if (violations.length) violations.slice(0, 5).forEach(function(v) { console.log('  ! ' + v); });
console.log('  Total hints checked: ' + total);

test('No hints contain raw HTML tags (' + violations.length + ' violations)', violations.length === 0);

console.log('\n' + '='.repeat(50));
console.log('rp-no-html-in-hint: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
