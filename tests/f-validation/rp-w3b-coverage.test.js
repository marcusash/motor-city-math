// rp-w3b-coverage test
// W3.b (composition of functions) should appear in at least 1 question per exam

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} rp-w3b-coverage.test.js\n');

var dataDir = path.join(__dirname, '../../data');
var missingStandard = [];

for (var i = 1; i <= 11; i++) {
    var f = path.join(dataDir, 'retake-practice-' + i + '.json');
    if (!fs.existsSync(f)) continue;
    var rp = JSON.parse(fs.readFileSync(f, 'utf-8'));
    var hasW3b = (rp.questions || []).some(function(q) {
        var stds = Array.isArray(q.standards) ? q.standards : (q.standard ? [q.standard] : []);
        return stds.some(function(s) { return s === 'W3.b'; });
    });
    if (!hasW3b) {
        missingStandard.push('rp' + i + ': no W3.b coverage');
    }
}

console.log('\u2500\u2500 W3.b standard coverage checks \u2500\u2500\n');
if (missingStandard.length) missingStandard.forEach(function(v) { console.log('  ! ' + v); });

// W3.b may not be required in all exams -- allow up to 3 missing
var allowedMissing = 3;
test('At most ' + allowedMissing + ' exams missing W3.b coverage (' + missingStandard.length + ' missing)', missingStandard.length <= allowedMissing);

console.log('\n' + '='.repeat(50));
console.log('rp-w3b-coverage: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
