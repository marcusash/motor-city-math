// rp-hint-not-same-as-question test
// Hint text must not be identical to (or a substring of) the question_html
// Hints should add guidance, not just repeat the question

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} rp-hint-not-same-as-question.test.js\n');

var dataDir = path.join(__dirname, '../../data');
var violations = [];

for (var i = 1; i <= 11; i++) {
    var f = path.join(dataDir, 'retake-practice-' + i + '.json');
    if (!fs.existsSync(f)) continue;
    var rp = JSON.parse(fs.readFileSync(f, 'utf-8'));
    (rp.questions || []).forEach(function(q) {
        if (!q.hint || !q.question_html) return;
        var hint = q.hint.trim().toLowerCase();
        var question = q.question_html.replace(/<[^>]+>/g, '').trim().toLowerCase();
        if (hint.length > 10 && question.indexOf(hint) !== -1) {
            violations.push(q.id + ': hint is a substring of question_html');
        }
    });
}

test('No hints are identical to or substrings of question_html (' + violations.length + ' violations)', violations.length === 0);
if (violations.length) violations.slice(0, 5).forEach(function(v) { console.log('    ! ' + v); });

console.log('\n' + '='.repeat(50));
console.log('rp-hint-not-same-as-question: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
