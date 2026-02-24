// rp-w2b-coverage-per-exam test
// Each RP exam must have at least 1 W2.b question
// W2.b is Kai's documented weakness -- every practice exam must address it

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} rp-w2b-coverage-per-exam.test.js\n');

var dataDir = path.join(__dirname, '../../data');

console.log('\u2500\u2500 W2.b coverage checks (min 1 per exam) \u2500\u2500\n');

var low = [], total = 0;
for (var i = 1; i <= 11; i++) {
    var f = path.join(dataDir, 'retake-practice-' + i + '.json');
    if (!fs.existsSync(f)) continue;
    total++;
    var rp = JSON.parse(fs.readFileSync(f, 'utf-8'));
    var w2bCount = (rp.questions || []).filter(function(q) {
        return q.standard && q.standard.includes('W2.b');
    }).length;
    console.log('  rp' + i + ': ' + w2bCount + ' W2.b question(s)');
    if (w2bCount < 1) {
        low.push('rp' + i + ': ' + w2bCount + ' W2.b questions (min 1)');
    }
}

if (low.length) {
    console.log('');
    low.forEach(function(v) { console.log('  ! ' + v); });
}

test('All ' + total + ' RP exams have at least 1 W2.b question', low.length === 0);

console.log('\n' + '='.repeat(50));
console.log('rp-w2b-coverage-per-exam: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
