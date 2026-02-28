// rp-question-ids-start-at-1 test
// Question IDs should start numbering from 1 (rp1-q1, not rp1-q0)
// Zero-indexed question IDs would confuse Kai and break display logic

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} rp-question-ids-start-at-1.test.js\n');

var dataDir = path.join(__dirname, '../../data');
var violations = [];

for (var i = 1; i <= 11; i++) {
    var f = path.join(dataDir, 'retake-practice-' + i + '.json');
    if (!fs.existsSync(f)) continue;
    var rp = JSON.parse(fs.readFileSync(f, 'utf-8'));
    var qs = rp.questions || [];
    if (qs.length > 0) {
        var firstId = qs[0].id || '';
        // Should be rp{i}-q1, not rp{i}-q0
        if (/q0$/.test(firstId)) {
            violations.push('retake-practice-' + i + ': first question id=' + firstId + ' (zero-indexed)');
        }
    }
}

console.log('\u2500\u2500 Question ID start-at-1 checks \u2500\u2500\n');
if (violations.length) violations.forEach(function(v) { console.log('  ! ' + v); });

test('No exams use zero-indexed question IDs (' + violations.length + ' violations)', violations.length === 0);

console.log('\n' + '='.repeat(50));
console.log('rp-question-ids-start-at-1: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
