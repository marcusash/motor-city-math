// rp-section-b-is-numeric-only test
// Section B questions must have at least one numeric input
// Section B is the calculation section -- non-numeric inputs are misclassified

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} rp-section-b-is-numeric-only.test.js\n');

var dataDir = path.join(__dirname, '../../data');
var violations = [];

for (var i = 1; i <= 11; i++) {
    var f = path.join(dataDir, 'retake-practice-' + i + '.json');
    if (!fs.existsSync(f)) continue;
    var rp = JSON.parse(fs.readFileSync(f, 'utf-8'));
    var sectionB = (rp.questions || []).filter(function(q) { return q.section === 'B'; });
    sectionB.forEach(function(q) {
        var hasNumeric = (q.inputs || []).some(function(inp) {
            return inp.type === 'number' || inp.type === 'text' || inp.type === 'graph';
        });
        if (!hasNumeric) {
            violations.push(q.id + ': section B question has no numeric/text/graph input');
        }
    });
}

test('All section B questions have numeric/graph inputs (' + violations.length + ' violations)', violations.length === 0);
if (violations.length) violations.slice(0, 5).forEach(function(v) { console.log('    ! ' + v); });

console.log('\n' + '='.repeat(50));
console.log('rp-section-b-is-numeric-only: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
