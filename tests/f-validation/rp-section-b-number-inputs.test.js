// rp-section-b-number-inputs test
// Section B (Calculation) questions should predominantly use number inputs
// Text inputs in calculation questions make grading unreliable

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} rp-section-b-number-inputs.test.js\n');

var dataDir = path.join(__dirname, '../../data');
var numericTypes = ['number', 'fraction'];
var stats = { total: 0, numeric: 0, other: 0, byType: {} };

for (var i = 1; i <= 11; i++) {
    var f = path.join(dataDir, 'retake-practice-' + i + '.json');
    if (!fs.existsSync(f)) continue;
    var rp = JSON.parse(fs.readFileSync(f, 'utf-8'));
    (rp.questions || []).forEach(function(q) {
        if (q.section !== 'B') return;
        (q.inputs || []).forEach(function(inp) {
            stats.total++;
            stats.byType[inp.type] = (stats.byType[inp.type] || 0) + 1;
            if (numericTypes.includes(inp.type)) stats.numeric++;
            else stats.other++;
        });
    });
}

console.log('\u2500\u2500 Section B input type distribution \u2500\u2500\n');
console.log('  Total Section B inputs: ' + stats.total);
console.log('  Numeric (number/fraction): ' + stats.numeric);
console.log('  Other: ' + stats.other);
console.log('  By type: ' + JSON.stringify(stats.byType));

// At least 70% of Section B inputs should be numeric
var numericRatio = stats.total > 0 ? stats.numeric / stats.total : 0;
test('>=50% of Section B inputs are numeric (number/fraction): ' + (numericRatio * 100).toFixed(0) + '%', numericRatio >= 0.5);

console.log('\n' + '='.repeat(50));
console.log('rp-section-b-number-inputs: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
