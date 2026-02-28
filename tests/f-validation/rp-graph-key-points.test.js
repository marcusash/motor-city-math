// RP key-points graph data test
// Questions of type "graph" should have key_points array in their data
// key_points define the points Kai needs to plot (x, y coordinates)

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} rp-graph-key-points.test.js\n');

var dataDir = path.join(__dirname, '../../data');
var graphQs = [], noKeyPoints = [], badFormat = [];

for (var i = 1; i <= 11; i++) {
    var f = path.join(dataDir, 'retake-practice-' + i + '.json');
    if (!fs.existsSync(f)) continue;
    var rp = JSON.parse(fs.readFileSync(f, 'utf-8'));
    (rp.questions || []).forEach(function(q) {
        if (q.type !== 'graph') return;
        graphQs.push('rp' + i + ' ' + q.id);
        if (!q.key_points && !q.graph) {
            noKeyPoints.push('rp' + i + ' ' + q.id + ': no key_points or graph field');
        } else if (q.key_points) {
            if (!Array.isArray(q.key_points)) {
                badFormat.push('rp' + i + ' ' + q.id + ': key_points is not an array');
            } else if (q.key_points.length === 0) {
                noKeyPoints.push('rp' + i + ' ' + q.id + ': key_points is empty');
            }
        }
    });
}

console.log('\u2500\u2500 Graph question key_points checks \u2500\u2500\n');
console.log('  Graph questions found: ' + graphQs.length);
if (graphQs.length > 0) console.log('  ' + graphQs.join(', '));

// Expect at least some graph questions
test('At least 1 graph question exists across all exams', graphQs.length >= 1);
test('All graph questions have key_points or graph field', noKeyPoints.length === 0);
test('All key_points are valid arrays', badFormat.length === 0);

if (noKeyPoints.length) noKeyPoints.forEach(function(v) { console.log('  ! ' + v); });
if (badFormat.length) badFormat.forEach(function(v) { console.log('  ! ' + v); });

console.log('\n' + '='.repeat(50));
console.log('rp-graph-key-points: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
