// rp-graph-function-parseable test
// Graph function field must be a valid JavaScript expression that can be evaluated
// Invalid functions crash the canvas renderer when Kai opens a graph question

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} rp-graph-function-parseable.test.js\n');

var dataDir = path.join(__dirname, '../../data');
var broken = [], total = 0;

for (var i = 1; i <= 11; i++) {
    var f = path.join(dataDir, 'retake-practice-' + i + '.json');
    if (!fs.existsSync(f)) continue;
    var rp = JSON.parse(fs.readFileSync(f, 'utf-8'));
    (rp.questions || []).forEach(function(q) {
        if (!q.graph || !q.graph.function) return;
        total++;
        var fn = q.graph.function;
        try {
            // Same pattern used in exam.html: new Function('x', 'return ' + fn)
            new Function('x', 'return ' + fn);
        } catch(e) {
            broken.push('rp' + i + ' ' + q.id + ': function="' + fn + '" ERROR: ' + e.message);
        }
    });
}

console.log('\u2500\u2500 Graph function parseability checks \u2500\u2500\n');
if (broken.length) broken.forEach(function(v) { console.log('  ! ' + v); });

test('All ' + total + ' graph functions are parseable as JS expressions', broken.length === 0);

console.log('\n' + '='.repeat(50));
console.log('rp-graph-function-parseable: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
