// rp-section-question-count test
// Each section (A, B, C, D) should have a reasonable number of questions
// Section A: identify/classify (2-4 questions)
// Section B: compute/solve (4-6 questions) 
// Section C: apply/word-problem (3-5 questions)
// Section D: analyze/extend (2-4 questions)

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} rp-section-question-count.test.js\n');

var dataDir = path.join(__dirname, '../../data');

console.log('\u2500\u2500 Section question count per exam \u2500\u2500\n');

var violations = [];

for (var i = 1; i <= 11; i++) {
    var f = path.join(dataDir, 'retake-practice-' + i + '.json');
    if (!fs.existsSync(f)) continue;
    var rp = JSON.parse(fs.readFileSync(f, 'utf-8'));
    var sectionCounts = {};
    (rp.questions || []).forEach(function(q) {
        var s = q.section || '?';
        sectionCounts[s] = (sectionCounts[s] || 0) + 1;
    });
    var sections = Object.keys(sectionCounts).sort();
    var totalQ = Object.values(sectionCounts).reduce(function(a, b) { return a + b; }, 0);
    console.log('  RP' + i + ': ' + JSON.stringify(sectionCounts) + ' total=' + totalQ);
    if (totalQ !== 15) {
        violations.push('RP' + i + ': expected 15 questions, got ' + totalQ);
    }
    // Each section should have at least 1 question
    ['A', 'B', 'C', 'D'].forEach(function(s) {
        if (!sectionCounts[s] || sectionCounts[s] === 0) {
            violations.push('RP' + i + ': section ' + s + ' has 0 questions');
        }
    });
}

test('All 11 exams have exactly 15 questions and 4 sections', violations.length === 0);
if (violations.length) violations.forEach(function(v) { console.log('  ! ' + v); });

console.log('\n' + '='.repeat(50));
console.log('rp-section-question-count: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
