// rp-question-html-not-empty test
// question_html field must be non-empty for all questions
// Empty question HTML renders a blank question card to Kai

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} rp-question-html-not-empty.test.js\n');

var dataDir = path.join(__dirname, '../../data');
var empty = [], total = 0;

for (var i = 1; i <= 11; i++) {
    var f = path.join(dataDir, 'retake-practice-' + i + '.json');
    if (!fs.existsSync(f)) continue;
    var rp = JSON.parse(fs.readFileSync(f, 'utf-8'));
    (rp.questions || []).forEach(function(q) {
        total++;
        var html = q.question_html || '';
        if (html.trim().length === 0) {
            empty.push('rp' + i + ' ' + q.id + ': question_html is empty');
        }
    });
}

console.log('\u2500\u2500 Question HTML not-empty checks \u2500\u2500\n');
if (empty.length) empty.forEach(function(v) { console.log('  ! ' + v); });

test('All ' + total + ' questions have non-empty question_html', empty.length === 0);

console.log('\n' + '='.repeat(50));
console.log('rp-question-html-not-empty: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
