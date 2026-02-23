// rp-graph-key-points-valid test
// Graph questions with key_points must have valid coordinate pairs [x, y]
// Invalid key_points cause the graph renderer to throw errors

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} rp-graph-key-points-valid.test.js\n');

var dataDir = path.join(__dirname, '../../data');
var issues = [], keyPointsChecked = 0;

for (var i = 1; i <= 11; i++) {
    var f = path.join(dataDir, 'retake-practice-' + i + '.json');
    if (!fs.existsSync(f)) continue;
    var rp = JSON.parse(fs.readFileSync(f, 'utf-8'));
    (rp.questions || []).forEach(function(q) {
        if (q.graph && q.graph.key_points) {
            q.graph.key_points.forEach(function(pt, idx) {
                keyPointsChecked++;
                if (!Array.isArray(pt) || pt.length < 2) {
                    issues.push('rp' + i + ' ' + q.id + ' key_points[' + idx + ']: not a [x,y] array');
                } else if (typeof pt[0] !== 'number' || typeof pt[1] !== 'number') {
                    issues.push('rp' + i + ' ' + q.id + ' key_points[' + idx + ']: non-numeric coords: ' + JSON.stringify(pt));
                }
            });
        }
    });
}

console.log('\u2500\u2500 Graph key_points validation checks \u2500\u2500\n');
if (issues.length) issues.slice(0, 5).forEach(function(v) { console.log('  ! ' + v); });

test('Key points checked: ' + keyPointsChecked, keyPointsChecked >= 20);
test('All key_points are valid [x, y] number pairs', issues.length === 0);

console.log('\n' + '='.repeat(50));
console.log('rp-graph-key-points-valid: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
