// rp-graph-canvas-id-matches-question test
// Each graph question's canvas_id must reference the same question ID
// Mismatched canvas IDs mean the graph renders in the wrong container

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} rp-graph-canvas-id-matches-question.test.js\n');

var dataDir = path.join(__dirname, '../../data');
var mismatches = [], graphQs = 0;

for (var i = 1; i <= 11; i++) {
    var f = path.join(dataDir, 'retake-practice-' + i + '.json');
    if (!fs.existsSync(f)) continue;
    var rp = JSON.parse(fs.readFileSync(f, 'utf-8'));
    (rp.questions || []).filter(function(q) { return q.graph && q.graph.canvas_id; }).forEach(function(q) {
        graphQs++;
        var canvasId = q.graph.canvas_id;
        // canvas_id should contain the question number (e.g., q.id is rp1-q12, canvas_id is chart_q12)
        var qNum = q.id.replace(/.*-q/, '');
        if (!canvasId.includes('q' + qNum) && !canvasId.includes(qNum)) {
            mismatches.push('rp' + i + ' ' + q.id + ': canvas_id="' + canvasId + '" doesnt match q' + qNum);
        }
    });
}

console.log('\u2500\u2500 Canvas ID match checks \u2500\u2500\n');
if (mismatches.length) mismatches.forEach(function(v) { console.log('  ! ' + v); });

test('Graph questions checked: ' + graphQs, graphQs >= 22);
test('All canvas_ids reference the correct question number', mismatches.length === 0);

console.log('\n' + '='.repeat(50));
console.log('rp-graph-canvas-id-matches-question: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
