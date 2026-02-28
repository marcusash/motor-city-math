// rp-standard-follows-pattern test
// Each question's standard field must match the pattern W[digit].[letter]
// e.g. W2.a, W3.b, W1.c etc.

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} rp-standard-follows-pattern.test.js\n');

var dataDir = path.join(__dirname, '../../data');
var violations = [];
var standardPattern = /^W\d+\.[a-z]$/;

for (var i = 1; i <= 11; i++) {
    var f = path.join(dataDir, 'retake-practice-' + i + '.json');
    if (!fs.existsSync(f)) continue;
    var rp = JSON.parse(fs.readFileSync(f, 'utf-8'));
    (rp.questions || []).forEach(function(q) {
        var s = q.standard;
        if (!s || !standardPattern.test(s)) {
            violations.push('retake-practice-' + i + ' q' + q.number + ': standard="' + s + '" does not match W#.x pattern');
        }
    });
}

test('All question standards match W#.x pattern (' + violations.length + ' violations)', violations.length === 0);
if (violations.length) violations.forEach(function(v) { console.log('    ! ' + v); });

console.log('\n' + '='.repeat(50));
console.log('rp-standard-follows-pattern: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
