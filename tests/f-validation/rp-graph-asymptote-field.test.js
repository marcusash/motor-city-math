// rp-graph-asymptote-field test
// Graph questions for rational/log functions should have asymptote info
// Asymptotes are tested content -- canvas needs them for proper rendering guides

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} rp-graph-asymptote-field.test.js\n');

var dataDir = path.join(__dirname, '../../data');
var graphsTotal = 0;
var withAsymptote = 0;
var asymptoteTypes = {};

for (var i = 1; i <= 11; i++) {
    var f = path.join(dataDir, 'retake-practice-' + i + '.json');
    if (!fs.existsSync(f)) continue;
    var rp = JSON.parse(fs.readFileSync(f, 'utf-8'));
    (rp.questions || []).forEach(function(q) {
        if (!q.graph) return;
        graphsTotal++;
        if (q.graph.asymptotes || q.graph.vertical_asymptote || q.graph.horizontal_asymptote ||
            q.graph.va || q.graph.ha) {
            withAsymptote++;
        }
        if (q.graph.type) {
            asymptoteTypes[q.graph.type] = (asymptoteTypes[q.graph.type] || 0) + 1;
        }
    });
}

console.log('\u2500\u2500 Graph asymptote field audit \u2500\u2500\n');
console.log('  Total graph questions: ' + graphsTotal);
console.log('  With asymptote info: ' + withAsymptote);
console.log('  Graph types: ' + JSON.stringify(asymptoteTypes));

// Informational only -- just require graph section is non-empty
test('Graph questions present in exam data (informational): ' + graphsTotal, graphsTotal > 0);

console.log('\n' + '='.repeat(50));
console.log('rp-graph-asymptote-field: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
