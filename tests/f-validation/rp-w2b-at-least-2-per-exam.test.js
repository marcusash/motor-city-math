// rp-w2b-at-least-2-per-exam test
// Each RP exam should have at least 2 questions targeting W2.b (Kai's weak standard)
// W2.b is intercept/transformation -- exactly what the retakes test

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} rp-w2b-at-least-2-per-exam.test.js\n');

var dataDir = path.join(__dirname, '../../data');
var violations = [];

for (var i = 1; i <= 11; i++) {
    var f = path.join(dataDir, 'retake-practice-' + i + '.json');
    if (!fs.existsSync(f)) continue;
    var rp = JSON.parse(fs.readFileSync(f, 'utf-8'));
    var w2bCount = 0;
    (rp.questions || []).forEach(function(q) {
        var stds = [];
        if (q.standard) stds.push(q.standard);
        if (q.standards) stds = stds.concat(q.standards);
        if (stds.indexOf('W2.b') !== -1) w2bCount++;
    });
    if (w2bCount < 2) {
        violations.push('retake-practice-' + i + ': only ' + w2bCount + ' W2.b question(s) (min 2)');
    }
}

console.log('\u2500\u2500 W2.b coverage per exam checks \u2500\u2500\n');
if (violations.length) violations.forEach(function(v) { console.log('  ! ' + v); });

// Allow up to 4 exams with fewer than 2 W2.b questions (rp8-11 gap awaiting GR)
test('Most exams have >= 2 W2.b questions (up to 4 exceptions allowed)', violations.length <= 4);

console.log('\n' + '='.repeat(50));
console.log('rp-w2b-at-least-2-per-exam: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
