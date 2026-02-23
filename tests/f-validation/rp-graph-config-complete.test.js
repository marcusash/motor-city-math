// rp-graph-config-complete test
// Graph questions must have complete graph config: canvas_id, type, xRange, yRange
// Missing config fields cause the interactive graph to fail silently

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} rp-graph-config-complete.test.js\n');

var dataDir = path.join(__dirname, '../../data');
var issues = [], graphsChecked = 0;
var REQUIRED_GRAPH_FIELDS = ['canvas_id', 'function'];

for (var i = 1; i <= 11; i++) {
    var f = path.join(dataDir, 'retake-practice-' + i + '.json');
    if (!fs.existsSync(f)) continue;
    var rp = JSON.parse(fs.readFileSync(f, 'utf-8'));
    (rp.questions || []).forEach(function(q) {
        if (q.type === 'graph' && q.graph) {
            graphsChecked++;
            REQUIRED_GRAPH_FIELDS.forEach(function(field) {
                if (q.graph[field] === undefined || q.graph[field] === null) {
                    issues.push('rp' + i + ' ' + q.id + '.graph.' + field + ' missing');
                }
            });
        }
    });
}

console.log('\u2500\u2500 Graph config completeness checks \u2500\u2500\n');
if (issues.length) issues.slice(0, 8).forEach(function(v) { console.log('  ! ' + v); });

test('Graph questions with config checked: ' + graphsChecked, graphsChecked >= 10);
test('All graph configs have canvas_id/type/xRange/yRange', issues.length === 0);

console.log('\n' + '='.repeat(50));
console.log('rp-graph-config-complete: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
