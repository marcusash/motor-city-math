// rp-graph-min-points-set test
// Graph objects with key_points must have min_points defined (tells Kai how many to plot)

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} rp-graph-min-points-set.test.js\n');

var dataDir = path.join(__dirname, '../../data');
var violations = [];
var total = 0;

for (var i = 1; i <= 11; i++) {
    var f = path.join(dataDir, 'retake-practice-' + i + '.json');
    if (!fs.existsSync(f)) continue;
    var rp = JSON.parse(fs.readFileSync(f, 'utf-8'));
    (rp.questions || []).forEach(function(q) {
        if (!q.graph) return;
        if (!Array.isArray(q.graph.key_points) || q.graph.key_points.length === 0) return;
        total++;
        if (q.graph.min_points === undefined || q.graph.min_points === null) {
            violations.push('rp' + i + ' ' + q.id + ': has key_points but no min_points');
        }
    });
}

console.log('\u2500\u2500 Graph min_points checks \u2500\u2500\n');
if (violations.length) violations.forEach(function(v) { console.log('  ! ' + v); });
console.log('  Graphs with key_points checked: ' + total);

test('All graphs with key_points have min_points (' + violations.length + ' violations)', violations.length === 0);

console.log('\n' + '='.repeat(50));
console.log('rp-graph-min-points-set: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
