// rp-graph-key-points-count test
// Graph questions must have at least 2 key_points defined
// A graph with 0 or 1 anchor points cannot be drawn accurately

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} rp-graph-key-points-count.test.js\n');

var dataDir = path.join(__dirname, '../../data');
var tooFew = [], totalGraph = 0;

for (var i = 1; i <= 11; i++) {
    var f = path.join(dataDir, 'retake-practice-' + i + '.json');
    if (!fs.existsSync(f)) continue;
    var rp = JSON.parse(fs.readFileSync(f, 'utf-8'));
    (rp.questions || []).forEach(function(q) {
        if (!q.graph) return;
        totalGraph++;
        var pts = q.graph.key_points || [];
        if (pts.length < 2) {
            tooFew.push('rp' + i + ' ' + q.id + ': only ' + pts.length + ' key_point(s)');
        }
    });
}

console.log('\u2500\u2500 Graph key_points count checks \u2500\u2500\n');
if (tooFew.length) tooFew.forEach(function(v) { console.log('  ! ' + v); });
if (totalGraph === 0) console.log('  (no graph questions found)');

test('All ' + totalGraph + ' graph questions have >=2 key_points', tooFew.length === 0);

console.log('\n' + '='.repeat(50));
console.log('rp-graph-key-points-count: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
