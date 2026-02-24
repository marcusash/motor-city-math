// rp-graph-tolerance-present test
// Graph questions (with min_points > 0) must have a tolerance field for point placement grading

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} rp-graph-tolerance-present.test.js\n');

var dataDir = path.join(__dirname, '../../data');
var violations = [];
var total = 0;

for (var i = 1; i <= 11; i++) {
    var f = path.join(dataDir, 'retake-practice-' + i + '.json');
    if (!fs.existsSync(f)) continue;
    var rp = JSON.parse(fs.readFileSync(f, 'utf-8'));
    (rp.questions || []).forEach(function(q) {
        if (!q.graph) return;
        // Only check graphs that require plotting points
        var minPts = q.graph.min_points;
        if (!minPts || minPts < 1) return;
        total++;
        if (q.graph.tolerance === undefined || q.graph.tolerance === null) {
            violations.push('rp' + i + ' ' + q.id + ': graph has min_points=' + minPts + ' but no tolerance');
        }
    });
}

console.log('\u2500\u2500 Graph tolerance presence checks \u2500\u2500\n');
if (violations.length) violations.forEach(function(v) { console.log('  ! ' + v); });
console.log('  Graphing graphs checked: ' + total);

test('All graphing questions (min_points>0) have tolerance (' + violations.length + ' violations)', violations.length === 0);

console.log('\n' + '='.repeat(50));
console.log('rp-graph-tolerance-present: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
