// rp-question-html-no-alert test
// question_html fields must not contain JavaScript alert() calls
// Alert in HTML content would be a XSS vector / accidental code injection

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} rp-question-html-no-alert.test.js\n');

var dataDir = path.join(__dirname, '../../data');
var found = [], total = 0;

for (var i = 1; i <= 11; i++) {
    var f = path.join(dataDir, 'retake-practice-' + i + '.json');
    if (!fs.existsSync(f)) continue;
    var rp = JSON.parse(fs.readFileSync(f, 'utf-8'));
    (rp.questions || []).forEach(function(q) {
        total++;
        var html = q.question_html || '';
        if (/alert\s*\(|javascript:/i.test(html)) {
            found.push('rp' + i + ' ' + q.id + ': question_html contains alert() or javascript:');
        }
    });
}

console.log('\u2500\u2500 Question HTML security checks \u2500\u2500\n');
if (found.length) found.forEach(function(v) { console.log('  ! ' + v); });

test('All ' + total + ' question_html fields are free of alert()/javascript:', found.length === 0);

console.log('\n' + '='.repeat(50));
console.log('rp-question-html-no-alert: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
