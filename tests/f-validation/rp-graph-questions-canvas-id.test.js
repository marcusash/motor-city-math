// rp-graph-questions-canvas-id test
// Graph-type questions must have a canvas_id field so exam.html can render the chart

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} rp-graph-questions-canvas-id.test.js\n');

var dataDir = path.join(__dirname, '../../data');
var graphQsChecked = 0, missingCanvas = [];

for (var i = 1; i <= 11; i++) {
    var f = path.join(dataDir, 'retake-practice-' + i + '.json');
    if (!fs.existsSync(f)) continue;
    var rp = JSON.parse(fs.readFileSync(f, 'utf-8'));
    (rp.questions || []).forEach(function(q) {
        if (q.type === 'graph') {
            graphQsChecked++;
            if (!q.graph || !q.graph.canvas_id) {
                missingCanvas.push('rp' + i + ' ' + q.id + ': missing graph.canvas_id');
            }
        }
    });
}

console.log('\u2500\u2500 Graph question canvas_id checks \u2500\u2500\n');

test('Graph questions found across exams', graphQsChecked > 0);
if (missingCanvas.length) missingCanvas.forEach(function(v) { console.log('  ! ' + v); });
test('All graph questions have canvas_id (' + graphQsChecked + ' checked)', missingCanvas.length === 0);

console.log('\n' + '='.repeat(50));
console.log('rp-graph-questions-canvas-id: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
