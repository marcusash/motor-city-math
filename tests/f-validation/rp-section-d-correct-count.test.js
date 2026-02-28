// rp-section-d-correct-count test
// Exactly 2 Section D questions per exam (extended response)
// Schema spec: Section A=3, B=8, C=2, D=2

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} rp-section-d-correct-count.test.js\n');

var dataDir = path.join(__dirname, '../../data');
var EXPECTED = 2;

console.log('\u2500\u2500 Section D count checks (expected ' + EXPECTED + ') \u2500\u2500\n');

for (var i = 1; i <= 11; i++) {
    var f = path.join(dataDir, 'retake-practice-' + i + '.json');
    if (!fs.existsSync(f)) continue;
    var rp = JSON.parse(fs.readFileSync(f, 'utf-8'));
    var count = (rp.questions || []).filter(function(q) { return q.section === 'D'; }).length;
    var ok = count === EXPECTED;
    if (!ok) console.log('  ! rp' + i + ': Section D has ' + count + ' questions (expected ' + EXPECTED + ')');
    test('rp' + i + ': exactly ' + EXPECTED + ' Section D questions (' + count + ' found)', ok);
}

console.log('\n' + '='.repeat(50));
console.log('rp-section-d-correct-count: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
