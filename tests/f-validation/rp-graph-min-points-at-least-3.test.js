// rp-graph-min-points-at-least-3 test
// Graph inputs should require at least 3 key points for meaningful plotting
// Less than 3 points can't define a parabola or meaningful function shape

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} rp-graph-min-points-at-least-3.test.js\n');

var dataDir = path.join(__dirname, '../../data');
var violations = [];

for (var i = 1; i <= 11; i++) {
    var f = path.join(dataDir, 'retake-practice-' + i + '.json');
    if (!fs.existsSync(f)) continue;
    var rp = JSON.parse(fs.readFileSync(f, 'utf-8'));
    (rp.questions || []).forEach(function(q) {
        (q.inputs || []).forEach(function(inp) {
            if (inp.type === 'graph' && typeof inp.min_points === 'number') {
                if (inp.min_points < 3) {
                    violations.push(q.id + '/' + inp.id + ': min_points=' + inp.min_points + ' (should be >= 3)');
                }
            }
        });
    });
}

test('All graph inputs require >= 3 min_points (' + violations.length + ' violations)', violations.length === 0);
if (violations.length) violations.forEach(function(v) { console.log('    ! ' + v); });

console.log('\n' + '='.repeat(50));
console.log('rp-graph-min-points-at-least-3: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
