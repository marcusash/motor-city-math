// rp-graph-min-points-integer test
// graph.min_points must be a positive integer
// Float or zero values would produce unexpected grading behavior

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} rp-graph-min-points-integer.test.js\n');

var dataDir = path.join(__dirname, '../../data');
var violations = [];
var checked = 0;

for (var i = 1; i <= 11; i++) {
    var f = path.join(dataDir, 'retake-practice-' + i + '.json');
    if (!fs.existsSync(f)) continue;
    var rp = JSON.parse(fs.readFileSync(f, 'utf-8'));
    (rp.questions || []).forEach(function(q) {
        if (!q.graph || q.graph.min_points === undefined) return;
        checked++;
        var mp = q.graph.min_points;
        if (!Number.isInteger(mp) || mp < 1) {
            violations.push('rp' + i + ' ' + q.id + ': min_points=' + mp + ' (must be positive integer)');
        }
    });
}

console.log('\u2500\u2500 Graph min_points type checks \u2500\u2500\n');
if (violations.length) violations.forEach(function(v) { console.log('  ! ' + v); });
console.log('  Graphs with min_points checked: ' + checked);

test('All graph.min_points are positive integers (' + violations.length + ' violations)', violations.length === 0);

console.log('\n' + '='.repeat(50));
console.log('rp-graph-min-points-integer: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
