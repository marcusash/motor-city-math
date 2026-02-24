// rp-all-questions-have-hint test
// Every question across all RP exams must have a hint field (non-empty)

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} rp-all-questions-have-hint.test.js\n');

var dataDir = path.join(__dirname, '../../data');
var missing = [];

for (var i = 1; i <= 11; i++) {
    var f = path.join(dataDir, 'retake-practice-' + i + '.json');
    if (!fs.existsSync(f)) continue;
    var rp = JSON.parse(fs.readFileSync(f, 'utf-8'));
    (rp.questions || []).forEach(function(q) {
        if (!q.hint || q.hint.trim().length === 0) {
            missing.push(q.id + ' (rp' + i + ')');
        }
    });
}

test('All questions have a non-empty hint (' + missing.length + ' missing)', missing.length === 0);
if (missing.length) missing.slice(0, 5).forEach(function(m) { console.log('    ! ' + m); });

console.log('\n' + '='.repeat(50));
console.log('rp-all-questions-have-hint: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
