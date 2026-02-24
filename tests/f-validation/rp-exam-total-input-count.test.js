// rp-exam-total-input-count test
// Each RP exam should have between 15 and 60 total inputs
// Too few = questions with no answers; too many = overwhelming

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} rp-exam-total-input-count.test.js\n');

var dataDir = path.join(__dirname, '../../data');
var MIN = 15, MAX = 60;

console.log('\u2500\u2500 Total input count checks (' + MIN + '-' + MAX + ' per exam) \u2500\u2500\n');

for (var i = 1; i <= 11; i++) {
    var f = path.join(dataDir, 'retake-practice-' + i + '.json');
    if (!fs.existsSync(f)) continue;
    var rp = JSON.parse(fs.readFileSync(f, 'utf-8'));
    var inputCount = 0;
    (rp.questions || []).forEach(function(q) { inputCount += (q.inputs || []).length; });
    var ok = inputCount >= MIN && inputCount <= MAX;
    if (!ok) console.log('  ! rp' + i + ': ' + inputCount + ' inputs (expected ' + MIN + '-' + MAX + ')');
    test('rp' + i + ': ' + inputCount + ' total inputs in range', ok);
}

console.log('\n' + '='.repeat(50));
console.log('rp-exam-total-input-count: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
