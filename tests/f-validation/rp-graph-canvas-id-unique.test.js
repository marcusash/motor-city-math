// rp-graph-canvas-id-unique test
// Graph inputs must have unique canvas_id values within each exam

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} rp-graph-canvas-id-unique.test.js\n');

var dataDir = path.join(__dirname, '../../data');
var violations = [];

for (var i = 1; i <= 11; i++) {
    var f = path.join(dataDir, 'retake-practice-' + i + '.json');
    if (!fs.existsSync(f)) continue;
    var rp = JSON.parse(fs.readFileSync(f, 'utf-8'));
    var canvasIds = [];
    (rp.questions || []).forEach(function(q) {
        (q.inputs || []).forEach(function(inp) {
            if (inp.type === 'graph' && inp.canvas_id) {
                if (canvasIds.indexOf(inp.canvas_id) !== -1) {
                    violations.push('retake-practice-' + i + ' q' + q.number + ': duplicate canvas_id "' + inp.canvas_id + '"');
                } else {
                    canvasIds.push(inp.canvas_id);
                }
            }
        });
    });
}

test('Graph inputs have unique canvas_id values within each exam (' + violations.length + ' violations)', violations.length === 0);
if (violations.length) violations.forEach(function(v) { console.log('    ! ' + v); });

console.log('\n' + '='.repeat(50));
console.log('rp-graph-canvas-id-unique: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
