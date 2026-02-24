// rp-graph-range-present test
// All graph objects must have a function/equation field and canvas_id
// Graphs define their range via key_points and function evaluation, not explicit x_range/y_range

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} rp-graph-range-present.test.js\n');

var dataDir = path.join(__dirname, '../../data');
var violations = [];
var total = 0;

for (var i = 1; i <= 11; i++) {
    var f = path.join(dataDir, 'retake-practice-' + i + '.json');
    if (!fs.existsSync(f)) continue;
    var rp = JSON.parse(fs.readFileSync(f, 'utf-8'));
    (rp.questions || []).forEach(function(q) {
        if (!q.graph) return;
        total++;
        var g = q.graph;
        var hasFunction = g.function || g.fn || g.equation;
        var hasCanvas = g.canvas_id || g.canvasId;
        if (!hasFunction) violations.push('rp' + i + ' ' + q.id + ': graph missing function/fn/equation');
        if (!hasCanvas) violations.push('rp' + i + ' ' + q.id + ': graph missing canvas_id');
    });
}

console.log('\u2500\u2500 Graph required field checks \u2500\u2500\n');
if (violations.length) violations.forEach(function(v) { console.log('  ! ' + v); });
console.log('  Graphs checked: ' + total);

test('All graph objects have function and canvas_id (' + violations.length + ' violations)', violations.length === 0);

console.log('\n' + '='.repeat(50));
console.log('rp-graph-range-present: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
