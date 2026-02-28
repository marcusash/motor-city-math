// rp-graph-tolerance-reasonable test
// Graph tolerance should be between 0 and 5 (not absurdly large like 100)
// Tolerance larger than 5 units on a standard algebra graph makes grading meaningless

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} rp-graph-tolerance-reasonable.test.js\n');

var dataDir = path.join(__dirname, '../../data');
var violations = [];
var checked = 0;

for (var i = 1; i <= 11; i++) {
    var f = path.join(dataDir, 'retake-practice-' + i + '.json');
    if (!fs.existsSync(f)) continue;
    var rp = JSON.parse(fs.readFileSync(f, 'utf-8'));
    (rp.questions || []).forEach(function(q) {
        if (!q.graph) return;
        var tol = q.graph.tolerance;
        if (tol === undefined || tol === null) return;
        checked++;
        var t = parseFloat(tol);
        if (isNaN(t) || t < 0 || t > 5) {
            violations.push('rp' + i + ' ' + q.id + ': graph.tolerance=' + tol + ' (must be 0-5)');
        }
    });
}

console.log('\u2500\u2500 Graph tolerance range checks \u2500\u2500\n');
if (violations.length) violations.forEach(function(v) { console.log('  ! ' + v); });
console.log('  Graphs with tolerance checked: ' + checked);

test('All graph tolerances are between 0 and 5 (' + violations.length + ' violations)', violations.length === 0);

console.log('\n' + '='.repeat(50));
console.log('rp-graph-tolerance-reasonable: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
