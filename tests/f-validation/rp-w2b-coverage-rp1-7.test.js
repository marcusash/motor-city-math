// rp-w2b-coverage-rp1-7 test
// rp1-7 should have at least 2 W2.b questions (documented strength: 3-4)
// W2.b is Kai's documented weakness -- must be reinforced in early exams

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} rp-w2b-coverage-rp1-7.test.js\n');

var dataDir = path.join(__dirname, '../../data');
var MIN_W2B = 2;

console.log('\u2500\u2500 W2.b coverage checks for rp1-7 \u2500\u2500\n');

for (var i = 1; i <= 7; i++) {
    var f = path.join(dataDir, 'retake-practice-' + i + '.json');
    if (!fs.existsSync(f)) continue;
    var rp = JSON.parse(fs.readFileSync(f, 'utf-8'));
    var count = (rp.questions || []).filter(function(q) {
        return q.standard && q.standard.includes('W2.b');
    }).length;
    var ok = count >= MIN_W2B;
    if (!ok) console.log('  ! rp' + i + ': only ' + count + ' W2.b questions (min ' + MIN_W2B + ')');
    test('rp' + i + ': >= ' + MIN_W2B + ' W2.b questions (' + count + ' found)', ok);
}

console.log('\n' + '='.repeat(50));
console.log('rp-w2b-coverage-rp1-7: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
