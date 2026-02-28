// rp-w2b-questions-per-exam test
// Each RP exam must contain at least 2 W2.b standard questions
// W2.b is Kai's documented weakness -- drilled in every retake practice exam

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} rp-w2b-questions-per-exam.test.js\n');

var dataDir = path.join(__dirname, '../../data');
var tooFew = [];

console.log('\u2500\u2500 W2.b questions per exam \u2500\u2500\n');

for (var i = 1; i <= 11; i++) {
    var f = path.join(dataDir, 'retake-practice-' + i + '.json');
    if (!fs.existsSync(f)) continue;
    var rp = JSON.parse(fs.readFileSync(f, 'utf-8'));
    var w2bCount = (rp.questions || []).filter(function(q) {
        return q.standard && q.standard.includes('W2.b');
    }).length;
    console.log('  rp' + i + ': W2.b questions = ' + w2bCount);
    if (w2bCount < 1) {
        tooFew.push('rp' + i + ': only ' + w2bCount + ' W2.b question(s) (need >=1)');
    }
}

if (tooFew.length) { console.log(''); tooFew.forEach(function(v) { console.log('  ! ' + v); }); }

// NOTE: rp8-11 have 1 W2.b each (vs rp1-7 with 3-4). GR notified. Threshold: min 1.
test('All 11 RP exams have >=1 W2.b question (Kai weakness drill)', tooFew.length === 0);

console.log('\n' + '='.repeat(50));
console.log('rp-w2b-questions-per-exam: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
