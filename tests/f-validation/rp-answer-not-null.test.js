// rp-answer-not-null test
// inputs with numeric answer field must not have null values
// Null answers cause grading failures -- Kai gets marked wrong for correct work

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} rp-answer-not-null.test.js\n');

var dataDir = path.join(__dirname, '../../data');
var nullAnswers = [], totalWithAnswer = 0;
// Text inputs that legitimately have no answer field
var OPEN_ENDED = ['q3_cases', 'q5_factored', 'q15_model', 'q12_domain', 'q12_range',
                  'q13_domain', 'q13_range', 'q14_model', 'q3_end_behavior'];

for (var i = 1; i <= 11; i++) {
    var f = path.join(dataDir, 'retake-practice-' + i + '.json');
    if (!fs.existsSync(f)) continue;
    var rp = JSON.parse(fs.readFileSync(f, 'utf-8'));
    (rp.questions || []).forEach(function(q) {
        (q.inputs || []).forEach(function(inp) {
            if (OPEN_ENDED.some(function(oe) { return inp.id && inp.id.includes(oe.replace('q3_', '')); })) return;
            if (!('answer' in inp)) return; // no answer field = open-ended
            totalWithAnswer++;
            if (inp.answer === null || inp.answer === undefined) {
                nullAnswers.push('rp' + i + ' ' + q.id + '.' + inp.id + ': answer is null');
            }
        });
    });
}

console.log('\u2500\u2500 Null answer checks \u2500\u2500\n');
if (nullAnswers.length) nullAnswers.forEach(function(v) { console.log('  ! ' + v); });

test(totalWithAnswer + ' inputs with answer field: zero null values', nullAnswers.length === 0);

console.log('\n' + '='.repeat(50));
console.log('rp-answer-not-null: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
