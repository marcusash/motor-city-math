// rp-radio-answer-is-letter test
// Radio input answer fields must be A, B, C, or D (matching SAAS exam format)
// Numeric or other values would fail comparison in the grader

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} rp-radio-answer-is-letter.test.js\n');

var dataDir = path.join(__dirname, '../../data');
var VALID_LETTERS = ['A', 'B', 'C', 'D'];
var bad = [], total = 0;

for (var i = 1; i <= 11; i++) {
    var f = path.join(dataDir, 'retake-practice-' + i + '.json');
    if (!fs.existsSync(f)) continue;
    var rp = JSON.parse(fs.readFileSync(f, 'utf-8'));
    (rp.questions || []).forEach(function(q) {
        (q.inputs || []).forEach(function(inp) {
            if (inp.type !== 'radio') return;
            if (inp.answer === undefined || inp.answer === null) return;
            total++;
            var ans = String(inp.answer).trim();
            if (!VALID_LETTERS.includes(ans)) {
                bad.push('rp' + i + ' ' + q.id + ' inp=' + inp.id + ': answer="' + ans + '" (must be A/B/C/D)');
            }
        });
    });
}

console.log('\u2500\u2500 Radio answer letter checks \u2500\u2500\n');
if (bad.length) bad.forEach(function(v) { console.log('  ! ' + v); });

test('All ' + total + ' radio answers are A/B/C/D', bad.length === 0);

console.log('\n' + '='.repeat(50));
console.log('rp-radio-answer-is-letter: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
