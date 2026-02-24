// rp-section-b-is-numeric test
// Section B questions should have at least one numeric (number type) input
// Section B is the calculation section -- open-ended text inputs indicate a missing answer spec

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} rp-section-b-is-numeric.test.js\n');

var dataDir = path.join(__dirname, '../../data');
var violations = [];

for (var i = 1; i <= 11; i++) {
    var f = path.join(dataDir, 'retake-practice-' + i + '.json');
    if (!fs.existsSync(f)) continue;
    var rp = JSON.parse(fs.readFileSync(f, 'utf-8'));
    (rp.questions || []).filter(function(q) { return q.section === 'B'; }).forEach(function(q) {
        var hasNumeric = (q.inputs || []).some(function(inp) { return inp.type === 'number'; });
        var hasGraph = (q.inputs || []).some(function(inp) { return inp.type === 'graph'; });
        var hasRadio = (q.inputs || []).some(function(inp) { return inp.type === 'radio'; });
        // Section B should have numeric, graph, or radio inputs (not just open-ended text)
        var hasAnswerable = hasNumeric || hasGraph || hasRadio;
        if (!hasAnswerable) {
            violations.push(q.id + ': section B has no numeric/graph/radio inputs');
        }
    });
}

test('All section B questions have at least one answerable input (' + violations.length + ' violations)', violations.length === 0);
if (violations.length) violations.slice(0, 5).forEach(function(v) { console.log('    ! ' + v); });

console.log('\n' + '='.repeat(50));
console.log('rp-section-b-is-numeric: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
