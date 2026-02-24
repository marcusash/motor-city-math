// rp-hint-no-answer-giveaway test
// Hints must not directly state the numeric answer (avoid "answer is X" patterns)

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} rp-hint-no-answer-giveaway.test.js\n');

var dataDir = path.join(__dirname, '../../data');
// Detect "answer is X", "answer = X", "= X" at end of short hint, "the answer: X"
var GIVEAWAY = /\b(answer\s+(is|=|:)\s*[\d-]|result\s+is\s*[\d-])/i;
var violations = [];
var total = 0;

for (var i = 1; i <= 11; i++) {
    var f = path.join(dataDir, 'retake-practice-' + i + '.json');
    if (!fs.existsSync(f)) continue;
    var rp = JSON.parse(fs.readFileSync(f, 'utf-8'));
    (rp.questions || []).forEach(function(q) {
        if (typeof q.hint !== 'string') return;
        total++;
        if (GIVEAWAY.test(q.hint)) {
            violations.push('rp' + i + ' ' + q.id + ': "' + q.hint.slice(0, 60) + '"');
        }
    });
}

console.log('\u2500\u2500 Hint answer-giveaway checks \u2500\u2500\n');
if (violations.length) violations.slice(0, 5).forEach(function(v) { console.log('  ! ' + v); });
console.log('  Total hints checked: ' + total);

test('No hints directly state the answer (' + violations.length + ' violations)', violations.length === 0);

console.log('\n' + '='.repeat(50));
console.log('rp-hint-no-answer-giveaway: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
