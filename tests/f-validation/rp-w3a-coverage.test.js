// rp-w3a-coverage test
// Track W3.a standard coverage across all RP exams
// W3.a is transformations -- another key Algebra 2 standard

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} rp-w3a-coverage.test.js\n');

var dataDir = path.join(__dirname, '../../data');
var w3aByExam = {};

for (var i = 1; i <= 11; i++) {
    var f = path.join(dataDir, 'retake-practice-' + i + '.json');
    if (!fs.existsSync(f)) continue;
    var rp = JSON.parse(fs.readFileSync(f, 'utf-8'));
    w3aByExam[i] = (rp.questions || []).filter(function(q) {
        return q.standard && q.standard.includes('W3.a');
    }).length;
}

console.log('\u2500\u2500 W3.a coverage report \u2500\u2500\n');
var total = 0;
Object.keys(w3aByExam).forEach(function(i) {
    console.log('  rp' + i + ': ' + w3aByExam[i] + ' W3.a question(s)');
    total += w3aByExam[i];
});
console.log('  Total W3.a questions across all exams: ' + total);

// Informational -- just require total > 0
test('W3.a (transformations) covered across exams: ' + total + ' total questions', total > 0);

console.log('\n' + '='.repeat(50));
console.log('rp-w3a-coverage: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
