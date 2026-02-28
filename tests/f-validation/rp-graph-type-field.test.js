// rp-graph-type-field test
// Graph questions should have a graph.type field indicating what kind of graph
// (e.g., "line", "function", "scatter") -- helps the renderer pick the right mode

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} rp-graph-type-field.test.js\n');

var dataDir = path.join(__dirname, '../../data');
var missing = [], total = 0;

for (var i = 1; i <= 11; i++) {
    var f = path.join(dataDir, 'retake-practice-' + i + '.json');
    if (!fs.existsSync(f)) continue;
    var rp = JSON.parse(fs.readFileSync(f, 'utf-8'));
    (rp.questions || []).forEach(function(q) {
        if (!q.graph) return;
        total++;
        if (!q.graph.type && !q.graph['function']) {
            missing.push('rp' + i + ' ' + q.id + ': graph has no type or function field');
        }
    });
}

console.log('\u2500\u2500 Graph type field checks \u2500\u2500\n');
if (missing.length) missing.forEach(function(v) { console.log('  ! ' + v); });

if (total === 0) {
    test('No graph questions found (informational)', true);
} else {
    test('All ' + total + ' graph questions have type or function field', missing.length === 0);
}

console.log('\n' + '='.repeat(50));
console.log('rp-graph-type-field: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
