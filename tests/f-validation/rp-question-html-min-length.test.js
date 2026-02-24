// rp-question-html-min-length test
// Each question_html should be at least 10 characters (not empty or stub)
// Single-word questions are insufficient for a retake practice exam

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} rp-question-html-min-length.test.js\n');

var dataDir = path.join(__dirname, '../../data');
var MIN_LEN = 10;
var tooShort = [];

for (var i = 1; i <= 11; i++) {
    var f = path.join(dataDir, 'retake-practice-' + i + '.json');
    if (!fs.existsSync(f)) continue;
    var rp = JSON.parse(fs.readFileSync(f, 'utf-8'));
    (rp.questions || []).forEach(function(q) {
        var html = q.question_html || '';
        // Strip tags for content check
        var text = html.replace(/<[^>]+>/g, '').trim();
        if (text.length < MIN_LEN) {
            tooShort.push('rp' + i + ' ' + q.id + ': question text only ' + text.length + ' chars: "' + text.slice(0, 20) + '"');
        }
    });
}

console.log('\u2500\u2500 question_html min-length checks (min ' + MIN_LEN + ' chars of text) \u2500\u2500\n');
if (tooShort.length) tooShort.slice(0, 5).forEach(function(v) { console.log('  ! ' + v); });

test('All question_html have >= ' + MIN_LEN + ' chars of text content (' + tooShort.length + ' violations)', tooShort.length === 0);

console.log('\n' + '='.repeat(50));
console.log('rp-question-html-min-length: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
