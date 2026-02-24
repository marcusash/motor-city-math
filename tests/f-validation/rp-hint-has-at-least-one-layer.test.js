// rp-hint-has-at-least-one-layer test
// Every question in every RP exam must have at least one hint entry
// Hint is required for ADHD support -- blank hint means Kai is stuck with no help

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} rp-hint-has-at-least-one-layer.test.js\n');

var dataDir = path.join(__dirname, '../../data');
var noHint = [], totalQ = 0;

for (var i = 1; i <= 11; i++) {
    var f = path.join(dataDir, 'retake-practice-' + i + '.json');
    if (!fs.existsSync(f)) continue;
    var rp = JSON.parse(fs.readFileSync(f, 'utf-8'));
    (rp.questions || []).forEach(function(q) {
        totalQ++;
        var hint = q.hint;
        var hasHint = hint && (
            (typeof hint === 'string' && hint.trim().length > 0) ||
            (Array.isArray(hint) && hint.length > 0 && hint[0].trim().length > 0) ||
            (typeof hint === 'object' && hint !== null && Object.keys(hint).length > 0)
        );
        if (!hasHint) noHint.push('rp' + i + ' ' + q.id);
    });
}

console.log('\u2500\u2500 Hint presence checks \u2500\u2500\n');
if (noHint.length) noHint.forEach(function(v) { console.log('  ! no hint: ' + v); });

test('Total questions checked: ' + totalQ, totalQ >= 165);
test('All questions have at least 1 hint layer', noHint.length === 0);

console.log('\n' + '='.repeat(50));
console.log('rp-hint-has-at-least-one-layer: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
