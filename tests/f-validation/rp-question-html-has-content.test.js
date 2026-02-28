// rp-question-html-has-content test
// question_html must not be empty and must have at least 20 characters
// Short question_html often indicates truncated content during import

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} rp-question-html-has-content.test.js\n');

var dataDir = path.join(__dirname, '../../data');
var MIN_LEN = 20;
var tooShort = [], total = 0;

for (var i = 1; i <= 11; i++) {
    var f = path.join(dataDir, 'retake-practice-' + i + '.json');
    if (!fs.existsSync(f)) continue;
    var rp = JSON.parse(fs.readFileSync(f, 'utf-8'));
    (rp.questions || []).forEach(function(q) {
        total++;
        var html = q.question_html || '';
        // Strip HTML tags to check text content length
        var text = html.replace(/<[^>]+>/g, '').trim();
        if (text.length < MIN_LEN) {
            tooShort.push('rp' + i + ' ' + q.id + ': text content ' + text.length + ' chars (min ' + MIN_LEN + ')');
        }
    });
}

console.log('\u2500\u2500 Question HTML content checks (min ' + MIN_LEN + ' chars text) \u2500\u2500\n');
if (tooShort.length) tooShort.forEach(function(v) { console.log('  ! ' + v); });

test('All ' + total + ' questions have at least ' + MIN_LEN + ' chars of text content', tooShort.length === 0);

console.log('\n' + '='.repeat(50));
console.log('rp-question-html-has-content: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
