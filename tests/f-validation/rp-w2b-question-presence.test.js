// RP W2.b question presence test
// W2.b is Kai's documented weakness (identifying parent functions, intercepts)
// Every RP exam should have at least 1 W2.b question

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} rp-w2b-question-presence.test.js\n');

var dataDir = path.join(__dirname, '../../data');
var missingW2b = [], examsChecked = 0;

for (var i = 1; i <= 11; i++) {
    var f = path.join(dataDir, 'retake-practice-' + i + '.json');
    if (!fs.existsSync(f)) continue;
    var rp = JSON.parse(fs.readFileSync(f, 'utf-8'));
    examsChecked++;
    var w2bCount = (rp.questions || []).filter(function(q) { return q.standard === 'W2.b'; }).length;
    if (w2bCount === 0) {
        missingW2b.push('rp' + i + ': 0 W2.b questions');
    } else {
        console.log('  rp' + i + ': ' + w2bCount + ' W2.b question(s)');
    }
}

console.log('\u2500\u2500 W2.b question presence checks \u2500\u2500\n');

if (missingW2b.length) missingW2b.forEach(function(v) { console.log('  ! ' + v); });
test('All exams have at least 1 W2.b question (Kai weakness area)', missingW2b.length === 0);
test('All 11 exams checked', examsChecked === 11);

console.log('\n' + '='.repeat(50));
console.log('rp-w2b-question-presence: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
