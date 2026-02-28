// rp-graph-function-uses-x test
// Graph function strings must reference variable x
// A function without x is a constant, not a function -- would draw a horizontal line

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} rp-graph-function-uses-x.test.js\n');

var dataDir = path.join(__dirname, '../../data');
var noX = [], total = 0;

for (var i = 1; i <= 11; i++) {
    var f = path.join(dataDir, 'retake-practice-' + i + '.json');
    if (!fs.existsSync(f)) continue;
    var rp = JSON.parse(fs.readFileSync(f, 'utf-8'));
    (rp.questions || []).forEach(function(q) {
        if (!q.graph || !q.graph.function) return;
        total++;
        var fn = q.graph.function;
        // Must reference x as a variable (not just in parameter name)
        if (!/\bx\b/.test(fn)) {
            noX.push('rp' + i + ' ' + q.id + ': function="' + fn + '" (no x variable)');
        }
    });
}

console.log('\u2500\u2500 Graph function x-reference checks \u2500\u2500\n');
if (noX.length) noX.forEach(function(v) { console.log('  ! ' + v); });

test('All ' + total + ' graph functions reference variable x', noX.length === 0);

console.log('\n' + '='.repeat(50));
console.log('rp-graph-function-uses-x: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
