// rp-inputs-array-not-empty test
// Every question must have at least 1 input
// Questions with no inputs can never be answered or graded

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} rp-inputs-array-not-empty.test.js\n');

var dataDir = path.join(__dirname, '../../data');
var noInputs = [], total = 0;

for (var i = 1; i <= 11; i++) {
    var f = path.join(dataDir, 'retake-practice-' + i + '.json');
    if (!fs.existsSync(f)) continue;
    var rp = JSON.parse(fs.readFileSync(f, 'utf-8'));
    (rp.questions || []).forEach(function(q) {
        total++;
        var inputs = q.inputs || [];
        if (inputs.length === 0) {
            noInputs.push('rp' + i + ' ' + q.id + ': zero inputs');
        }
    });
}

console.log('\u2500\u2500 Inputs array checks \u2500\u2500\n');
if (noInputs.length) noInputs.forEach(function(v) { console.log('  ! ' + v); });

test('All ' + total + ' questions have at least 1 input', noInputs.length === 0);

console.log('\n' + '='.repeat(50));
console.log('rp-inputs-array-not-empty: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
