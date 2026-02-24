// rp-section-order-valid test
// Questions must be ordered A then B then C then D within each exam
// Out-of-order sections confuse the exam flow

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} rp-section-order-valid.test.js\n');

var dataDir = path.join(__dirname, '../../data');
var violations = [];
var SECTION_ORDER = {'A': 0, 'B': 1, 'C': 2, 'D': 3};

for (var i = 1; i <= 11; i++) {
    var f = path.join(dataDir, 'retake-practice-' + i + '.json');
    if (!fs.existsSync(f)) continue;
    var rp = JSON.parse(fs.readFileSync(f, 'utf-8'));
    var questions = rp.questions || [];
    var lastOrder = -1;
    questions.forEach(function(q) {
        var order = SECTION_ORDER[q.section];
        if (order !== undefined && order < lastOrder) {
            violations.push('retake-practice-' + i + ': section ' + q.section + ' appears after later section (question ' + q.id + ')');
        }
        if (order !== undefined && order > lastOrder) {
            lastOrder = order;
        }
    });
}

test('All exams have sections in A-B-C-D order (' + violations.length + ' violations)', violations.length === 0);
if (violations.length) violations.slice(0, 5).forEach(function(v) { console.log('    ! ' + v); });

console.log('\n' + '='.repeat(50));
console.log('rp-section-order-valid: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
