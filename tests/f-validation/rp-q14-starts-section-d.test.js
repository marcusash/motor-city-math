// rp-q14-starts-section-d test
// Question 14 must be in section D (the first word-problem question)
// If q14 is in B or C, the section ordering is broken

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} rp-q14-starts-section-d.test.js\n');

var dataDir = path.join(__dirname, '../../data');
var violations = [];

for (var i = 1; i <= 11; i++) {
    var f = path.join(dataDir, 'retake-practice-' + i + '.json');
    if (!fs.existsSync(f)) continue;
    var rp = JSON.parse(fs.readFileSync(f, 'utf-8'));
    var q14 = (rp.questions || []).find(function(q) { return q.number === 14; });
    if (q14 && q14.section !== 'D') {
        violations.push('retake-practice-' + i + ': q14 is in section ' + q14.section + ' (expected D)');
    }
}

test('Question 14 is in section D across all exams (' + violations.length + ' violations)', violations.length === 0);
if (violations.length) violations.forEach(function(v) { console.log('    ! ' + v); });

console.log('\n' + '='.repeat(50));
console.log('rp-q14-starts-section-d: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
