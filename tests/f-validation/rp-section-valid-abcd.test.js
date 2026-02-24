// rp-section-valid-abcd test
// Every question must have a section value that is exactly A, B, C, or D
// Any other value breaks the section display and grading logic

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} rp-section-valid-abcd.test.js\n');

var dataDir = path.join(__dirname, '../../data');
var violations = [];
var VALID = new Set(['A', 'B', 'C', 'D']);

for (var i = 1; i <= 11; i++) {
    var f = path.join(dataDir, 'retake-practice-' + i + '.json');
    if (!fs.existsSync(f)) continue;
    var rp = JSON.parse(fs.readFileSync(f, 'utf-8'));
    (rp.questions || []).forEach(function(q) {
        if (!VALID.has(q.section)) {
            violations.push('retake-practice-' + i + ' ' + q.id + ': section="' + q.section + '" (must be A/B/C/D)');
        }
    });
}

test('All questions have section A, B, C, or D (' + violations.length + ' violations)', violations.length === 0);
if (violations.length) violations.forEach(function(v) { console.log('    ! ' + v); });

console.log('\n' + '='.repeat(50));
console.log('rp-section-valid-abcd: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
