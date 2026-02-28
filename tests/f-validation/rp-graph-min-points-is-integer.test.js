// rp-graph-min-points-is-integer test
// graph input min_points must be a positive integer
// Fractional or negative min_points breaks the graph grader point-count check

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} rp-graph-min-points-is-integer.test.js\n');

var dataDir = path.join(__dirname, '../../data');
var violations = [];

for (var i = 1; i <= 11; i++) {
    var f = path.join(dataDir, 'retake-practice-' + i + '.json');
    if (!fs.existsSync(f)) continue;
    var rp = JSON.parse(fs.readFileSync(f, 'utf-8'));
    (rp.questions || []).forEach(function(q) {
        (q.inputs || []).filter(function(inp) { return inp.type === 'graph'; }).forEach(function(inp) {
            if (!Number.isInteger(inp.min_points) || inp.min_points < 1) {
                violations.push('retake-practice-' + i + ' ' + q.id + ': min_points=' + JSON.stringify(inp.min_points) + ' (must be positive integer)');
            }
        });
    });
}

test('All graph inputs have positive integer min_points (' + violations.length + ' violations)', violations.length === 0);
if (violations.length) violations.forEach(function(v) { console.log('    ! ' + v); });

console.log('\n' + '='.repeat(50));
console.log('rp-graph-min-points-is-integer: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
