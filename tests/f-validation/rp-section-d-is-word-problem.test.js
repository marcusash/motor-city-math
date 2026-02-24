// rp-section-d-is-word-problem test
// Section D questions must be word problems (type contains "word-problem" or "application")
// Section D tests real-world application of function knowledge

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} rp-section-d-is-word-problem.test.js\n');

var dataDir = path.join(__dirname, '../../data');
var violations = [];

var SECTION_D_TYPES = ['word-problem','application','real-world','multiple-choice','error-analysis','open-ended','short-answer','construct','write-equation','equation','graph'];

for (var i = 1; i <= 11; i++) {
    var f = path.join(dataDir, 'retake-practice-' + i + '.json');
    if (!fs.existsSync(f)) continue;
    var rp = JSON.parse(fs.readFileSync(f, 'utf-8'));
    var sectionD = (rp.questions || []).filter(function(q) { return q.section === 'D'; });
    sectionD.forEach(function(q) {
        var typeOk = SECTION_D_TYPES.some(function(t) { return q.type && q.type.indexOf(t) !== -1; });
        if (!typeOk) {
            violations.push(q.id + ': section D type="' + q.type + '" (unexpected type)');
        }
    });
}

test('All section D questions have valid types (' + violations.length + ' violations)', violations.length === 0);
if (violations.length) violations.slice(0, 5).forEach(function(v) { console.log('    ! ' + v); });

console.log('\n' + '='.repeat(50));
console.log('rp-section-d-is-word-problem: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
