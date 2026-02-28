// rp-section-c-graph-type test
// Section C questions must be type=graph (q12, q13)
// Section C is the graphing section -- non-graph types don't belong here

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} rp-section-c-graph-type.test.js\n');

var dataDir = path.join(__dirname, '../../data');
var nonGraph = [], graphCount = 0;

for (var i = 1; i <= 11; i++) {
    var f = path.join(dataDir, 'retake-practice-' + i + '.json');
    if (!fs.existsSync(f)) continue;
    var rp = JSON.parse(fs.readFileSync(f, 'utf-8'));
    (rp.questions || []).filter(function(q){ return q.section === 'C'; }).forEach(function(q) {
        // Graph section: type=graph, or types that render as graphs (rational has graph data)
        if (q.type === 'graph' || (q.graph && q.graph.function)) {
            graphCount++;
        } else {
            nonGraph.push('rp' + i + ' ' + q.id + ': section=C type=' + q.type + ' (expected graph or has graph data)');
        }
    });
}

console.log('\u2500\u2500 Section C graph type checks \u2500\u2500\n');
if (nonGraph.length) nonGraph.forEach(function(v) { console.log('  ! ' + v); });

test('Section C graph questions found: ' + graphCount, graphCount >= 22);
test('All Section C questions are type=graph', nonGraph.length === 0);

console.log('\n' + '='.repeat(50));
console.log('rp-section-c-graph-type: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
