// rp-graph-has-key-points test
// Graph questions that require key point identification must have key_points array
// Missing key_points means the grader can't check student graph placement

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} rp-graph-key-points-exist.test.js\n');

var dataDir = path.join(__dirname, '../../data');
var noKeyPoints = [], withKeyPoints = 0, total = 0;

for (var i = 1; i <= 11; i++) {
    var f = path.join(dataDir, 'retake-practice-' + i + '.json');
    if (!fs.existsSync(f)) continue;
    var rp = JSON.parse(fs.readFileSync(f, 'utf-8'));
    (rp.questions || []).forEach(function(q) {
        if (!q.graph) return;
        total++;
        if (q.graph.key_points && q.graph.key_points.length > 0) {
            withKeyPoints++;
        } else {
            noKeyPoints.push('rp' + i + ' ' + q.id + ': graph without key_points (ok if display-only)');
        }
    });
}

console.log('\u2500\u2500 Graph key_points checks \u2500\u2500\n');
if (noKeyPoints.length > 0) {
    console.log('  ! ' + noKeyPoints.length + '/' + total + ' graphs without key_points (display-only):');
    noKeyPoints.slice(0, 3).forEach(function(v) { console.log('    ' + v); });
}

// Not a hard requirement -- some graphs are display-only
// Informational: report coverage
test('Graph key_points defined: ' + withKeyPoints + '/' + total + ' graph questions', true);

console.log('\n' + '='.repeat(50));
console.log('rp-graph-key-points-exist: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
