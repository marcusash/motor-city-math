// rp-no-duplicate-question-html test
// Each question_html should be unique across all RP exams
// Duplicate question text indicates copy-paste error or repeated question

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} rp-no-duplicate-question-html.test.js\n');

var dataDir = path.join(__dirname, '../../data');
var seen = {}, duplicates = [], totalQuestions = 0;

for (var i = 1; i <= 11; i++) {
    var f = path.join(dataDir, 'retake-practice-' + i + '.json');
    if (!fs.existsSync(f)) continue;
    var rp = JSON.parse(fs.readFileSync(f, 'utf-8'));
    (rp.questions || []).forEach(function(q) {
        totalQuestions++;
        var html = (q.question_html || '').trim().toLowerCase().replace(/\s+/g, ' ');
        if (seen[html]) {
            duplicates.push(q.id + ' duplicates ' + seen[html]);
        } else {
            seen[html] = q.id;
        }
    });
}

console.log('\u2500\u2500 Question uniqueness checks \u2500\u2500\n');
if (duplicates.length) duplicates.slice(0, 5).forEach(function(v) { console.log('  ! ' + v); });
if (duplicates.length > 5) console.log('  ... and ' + (duplicates.length - 5) + ' more');

test('Questions checked: ' + totalQuestions, totalQuestions >= 165);
test('No duplicate question_html strings across all exams', duplicates.length === 0);

console.log('\n' + '='.repeat(50));
console.log('rp-no-duplicate-question-html: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
