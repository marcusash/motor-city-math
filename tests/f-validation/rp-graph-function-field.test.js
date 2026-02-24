// rp-graph-function-field test
// Graph questions must have a function field for the canvas renderer
// exam.html uses new Function() to evaluate the function expression

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} rp-graph-function-field.test.js\n');

var dataDir = path.join(__dirname, '../../data');
var missing = [];

for (var i = 1; i <= 11; i++) {
    var f = path.join(dataDir, 'retake-practice-' + i + '.json');
    if (!fs.existsSync(f)) continue;
    var rp = JSON.parse(fs.readFileSync(f, 'utf-8'));
    (rp.questions || []).forEach(function(q) {
        if (!q.graph) return;
        if (!q.graph.function && !q.graph.fn && !q.graph.equation) {
            missing.push('rp' + i + ' ' + q.id + ': graph present but no function/fn/equation field');
        }
    });
}

console.log('\u2500\u2500 Graph function field checks \u2500\u2500\n');
if (missing.length) missing.slice(0, 5).forEach(function(v) { console.log('  ! ' + v); });

test('All graph objects have function/fn/equation field (' + missing.length + ' violations)', missing.length === 0);

console.log('\n' + '='.repeat(50));
console.log('rp-graph-function-field: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
