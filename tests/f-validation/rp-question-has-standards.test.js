// rp-question-has-standards test
// Every question must have at least one standard associated (curriculum alignment)

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} rp-question-has-standards.test.js\n');

var dataDir = path.join(__dirname, '../../data');
var violations = [];
var total = 0;

for (var i = 1; i <= 11; i++) {
    var f = path.join(dataDir, 'retake-practice-' + i + '.json');
    if (!fs.existsSync(f)) continue;
    var rp = JSON.parse(fs.readFileSync(f, 'utf-8'));
    (rp.questions || []).forEach(function(q) {
        total++;
        var stds = Array.isArray(q.standards) ? q.standards : (q.standard ? [q.standard] : []);
        if (stds.length === 0) {
            violations.push('rp' + i + ' ' + q.id + ': no standards');
        }
    });
}

console.log('\u2500\u2500 Standard assignment checks \u2500\u2500\n');
if (violations.length) violations.slice(0, 5).forEach(function(v) { console.log('  ! ' + v); });
console.log('  Total questions: ' + total + ', missing standards: ' + violations.length);

test('All questions have at least 1 standard (' + violations.length + ' violations)', violations.length === 0);

console.log('\n' + '='.repeat(50));
console.log('rp-question-has-standards: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
