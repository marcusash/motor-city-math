// rp-graph-key-points-types test
// graph key_points should be arrays of {x, y} coordinate objects
// Invalid key_point formats break canvas rendering

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} rp-graph-key-points-types.test.js\n');

var dataDir = path.join(__dirname, '../../data');
var badPoints = [];
var totalPoints = 0;

for (var i = 1; i <= 11; i++) {
    var f = path.join(dataDir, 'retake-practice-' + i + '.json');
    if (!fs.existsSync(f)) continue;
    var rp = JSON.parse(fs.readFileSync(f, 'utf-8'));
    (rp.questions || []).forEach(function(q) {
        if (!q.graph || !q.graph.key_points) return;
        var kp = q.graph.key_points;
        if (!Array.isArray(kp)) {
            badPoints.push('rp' + i + ' ' + q.id + ': key_points not an array');
            return;
        }
        kp.forEach(function(pt, idx) {
            totalPoints++;
            // key_points can be {x,y} objects OR [x,y] arrays
            var isObjForm  = pt && typeof pt === 'object' && !Array.isArray(pt) &&
                             typeof pt.x === 'number' && typeof pt.y === 'number';
            var isArrForm  = Array.isArray(pt) && pt.length === 2 &&
                             typeof pt[0] === 'number' && typeof pt[1] === 'number';
            if (!isObjForm && !isArrForm) {
                badPoints.push('rp' + i + ' ' + q.id + ' key_points[' + idx + ']: must be {x,y} or [x,y]');
            }
        });
    });
}

console.log('\u2500\u2500 graph key_points type checks \u2500\u2500\n');
if (badPoints.length) badPoints.slice(0, 5).forEach(function(v) { console.log('  ! ' + v); });
console.log('  Total key_points validated: ' + totalPoints);

test('All graph key_points are {x:number, y:number} (' + badPoints.length + ' violations)', badPoints.length === 0);

console.log('\n' + '='.repeat(50));
console.log('rp-graph-key-points-types: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
