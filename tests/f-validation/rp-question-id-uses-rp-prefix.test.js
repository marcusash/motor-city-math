// rp-question-id-uses-rp-prefix test
// Question IDs must follow format "rpN-qM" where N is exam number and M is question number
// Wrong format breaks cross-exam result storage and analytics

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} rp-question-id-uses-rp-prefix.test.js\n');

var dataDir = path.join(__dirname, '../../data');
var violations = [];

for (var i = 1; i <= 11; i++) {
    var f = path.join(dataDir, 'retake-practice-' + i + '.json');
    if (!fs.existsSync(f)) continue;
    var rp = JSON.parse(fs.readFileSync(f, 'utf-8'));
    var pattern = new RegExp('^rp' + i + '-q\\d+$');
    (rp.questions || []).forEach(function(q) {
        if (!pattern.test(q.id)) {
            violations.push(q.id + ': expected format rp' + i + '-qN');
        }
    });
}

test('All question IDs follow rpN-qM format (' + violations.length + ' violations)', violations.length === 0);
if (violations.length) violations.slice(0, 5).forEach(function(v) { console.log('    ! ' + v); });

console.log('\n' + '='.repeat(50));
console.log('rp-question-id-uses-rp-prefix: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
