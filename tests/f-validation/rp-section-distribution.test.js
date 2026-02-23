// RP exam section distribution test
// Each RP exam must have questions in all 4 sections (A, B, C, D)
// Section balance matters for exam fairness and curriculum coverage

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} rp-section-distribution.test.js\n');

var dataDir = path.join(__dirname, '../../data');
var REQUIRED_SECTIONS = ['A', 'B', 'C', 'D'];
var allPass = true;
var examsChecked = 0;

for (var i = 1; i <= 11; i++) {
    var f = path.join(dataDir, 'retake-practice-' + i + '.json');
    if (!fs.existsSync(f)) continue;
    var rp = JSON.parse(fs.readFileSync(f, 'utf-8'));
    examsChecked++;
    var sections = {};
    (rp.questions || []).forEach(function(q) {
        sections[q.section] = (sections[q.section] || 0) + 1;
    });
    var missingSections = REQUIRED_SECTIONS.filter(function(s) { return !sections[s]; });
    if (missingSections.length > 0) {
        allPass = false;
        console.log('  ! rp' + i + ' missing sections: ' + missingSections.join(', '));
    }
}

console.log('\u2500\u2500 Section distribution checks \u2500\u2500\n');
console.log('  Exams checked: ' + examsChecked);
test('All ' + examsChecked + ' exams have questions in all 4 sections (A/B/C/D)', allPass);
test('At least 10 exams found', examsChecked >= 10);

console.log('\n' + '='.repeat(50));
console.log('rp-section-distribution: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
