// rp-input-label-unique-per-question test
// Within a question, input labels should not be duplicated

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} rp-input-label-unique-per-question.test.js\n');

var dataDir = path.join(__dirname, '../../data');
var violations = [];
var total = 0;

for (var i = 1; i <= 11; i++) {
    var f = path.join(dataDir, 'retake-practice-' + i + '.json');
    if (!fs.existsSync(f)) continue;
    var rp = JSON.parse(fs.readFileSync(f, 'utf-8'));
    (rp.questions || []).forEach(function(q) {
        var inputs = q.inputs || [];
        if (inputs.length < 2) return;
        total++;
        var labels = inputs.map(function(inp) { return (inp.label || '').trim().toLowerCase(); });
        var nonEmpty = labels.filter(function(l) { return l.length > 0; });
        var unique = new Set(nonEmpty);
        if (unique.size < nonEmpty.length) {
            violations.push('rp' + i + ' ' + q.id + ': duplicate input labels: [' + labels.join(', ') + ']');
        }
    });
}

console.log('\u2500\u2500 Input label uniqueness checks \u2500\u2500\n');
if (violations.length) violations.slice(0, 5).forEach(function(v) { console.log('  ! ' + v); });
console.log('  Multi-input questions checked: ' + total);

test('No question has duplicate input labels (' + violations.length + ' violations)', violations.length === 0);

console.log('\n' + '='.repeat(50));
console.log('rp-input-label-unique-per-question: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
