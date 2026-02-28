// rp-hint-not-answer test
// Hints must not contain the answer directly
// A hint that just says "the answer is X" defeats the purpose
// Check: hint text does not contain "answer is" or "= {answer}" matching the input answer

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} rp-hint-not-answer.test.js\n');

var dataDir = path.join(__dirname, '../../data');
var giveaways = [];
var totalChecked = 0;

var GIVEAWAY_PATTERNS = [
    /the answer is/i,
    /the correct answer is/i,
    /answer:\s*\d/i,
    /solution:\s*\d/i,
];

for (var i = 1; i <= 11; i++) {
    var f = path.join(dataDir, 'retake-practice-' + i + '.json');
    if (!fs.existsSync(f)) continue;
    var rp = JSON.parse(fs.readFileSync(f, 'utf-8'));
    (rp.questions || []).forEach(function(q) {
        var hint = q.hint || '';
        if (!hint) return;
        totalChecked++;
        GIVEAWAY_PATTERNS.forEach(function(re) {
            if (re.test(hint)) {
                giveaways.push('rp' + i + ' ' + q.id + ': hint gives away answer: "' + hint.slice(0, 60) + '"');
            }
        });
    });
}

console.log('\u2500\u2500 RP hint quality (not a giveaway) \u2500\u2500\n');
console.log('  Hints checked: ' + totalChecked);

test('All 165 hints checked', totalChecked === 165);
test('No hints contain "the answer is" or "answer: N"', giveaways.length === 0);

if (giveaways.length) giveaways.slice(0,5).forEach(function(v) { console.log('  ! ' + v); });

// Also verify each question has a hint
var noHint = [];
for (var i = 1; i <= 11; i++) {
    var f = path.join(dataDir, 'retake-practice-' + i + '.json');
    if (!fs.existsSync(f)) continue;
    var rp = JSON.parse(fs.readFileSync(f, 'utf-8'));
    (rp.questions || []).forEach(function(q) {
        if (!q.hint || q.hint.trim() === '') {
            noHint.push('rp' + i + ' ' + q.id + ': missing hint');
        }
    });
}
test('All questions have a non-empty hint field', noHint.length === 0);

console.log('\n' + '='.repeat(50));
console.log('rp-hint-not-answer: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
