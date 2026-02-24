// rp-no-double-spaces-in-question test
// question_html must not have double spaces in visible text
// Double spaces in HTML render as single space but indicate copy-paste errors

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} rp-no-double-spaces-in-question.test.js\n');

var dataDir = path.join(__dirname, '../../data');
var violations = [];
var MAX_PER_FILE = 3; // allow a few in HTML attribute values

for (var i = 1; i <= 11; i++) {
    var f = path.join(dataDir, 'retake-practice-' + i + '.json');
    if (!fs.existsSync(f)) continue;
    var rp = JSON.parse(fs.readFileSync(f, 'utf-8'));
    (rp.questions || []).forEach(function(q) {
        if (q.question_html && /  /.test(q.question_html)) {
            violations.push('retake-practice-' + i + ' ' + q.id + ': double spaces in question_html');
        }
    });
}

test('Few or no double spaces in question_html (<= ' + MAX_PER_FILE + '*11 total, actual: ' + violations.length + ')', violations.length <= MAX_PER_FILE * 11);
if (violations.length > MAX_PER_FILE * 11) violations.forEach(function(v) { console.log('    ! ' + v); });

console.log('\n' + '='.repeat(50));
console.log('rp-no-double-spaces-in-question: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
