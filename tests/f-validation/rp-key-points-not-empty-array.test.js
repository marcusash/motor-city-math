// rp-key-points-not-empty-array test
// graph input key_points must be null or a non-empty array (never [])
// Empty array breaks the graph grader's point validation

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} rp-key-points-not-empty-array.test.js\n');

var dataDir = path.join(__dirname, '../../data');
var violations = [];

for (var i = 1; i <= 11; i++) {
    var f = path.join(dataDir, 'retake-practice-' + i + '.json');
    if (!fs.existsSync(f)) continue;
    var rp = JSON.parse(fs.readFileSync(f, 'utf-8'));
    (rp.questions || []).forEach(function(q) {
        (q.inputs || []).filter(function(inp) { return inp.type === 'graph'; }).forEach(function(inp) {
            if (Array.isArray(inp.key_points) && inp.key_points.length === 0) {
                violations.push('retake-practice-' + i + ' ' + q.id + ': key_points is [] (use null if no key points)');
            }
        });
    });
}

test('No graph inputs have empty [] key_points (' + violations.length + ' violations)', violations.length === 0);
if (violations.length) violations.forEach(function(v) { console.log('    ! ' + v); });

console.log('\n' + '='.repeat(50));
console.log('rp-key-points-not-empty-array: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
