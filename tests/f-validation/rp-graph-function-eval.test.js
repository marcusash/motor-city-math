// rp-graph-function-eval test
// Graph question functions must be valid JavaScript math expressions
// Invalid function strings cause new Function() to throw

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} rp-graph-function-eval.test.js\n');

var dataDir = path.join(__dirname, '../../data');
var issues = [], graphsChecked = 0;

for (var i = 1; i <= 11; i++) {
    var f = path.join(dataDir, 'retake-practice-' + i + '.json');
    if (!fs.existsSync(f)) continue;
    var rp = JSON.parse(fs.readFileSync(f, 'utf-8'));
    (rp.questions || []).forEach(function(q) {
        if (q.graph && q.graph.function) {
            graphsChecked++;
            try {
                var fn = new Function('x', 'return ' + q.graph.function);
                var testVal = fn(0); // Test at x=0
                if (typeof testVal !== 'number' || !isFinite(testVal)) {
                    // Infinity is OK at singularities -- just check it doesn't throw
                }
            } catch(e) {
                issues.push('rp' + i + ' ' + q.id + ': function parse error: ' + e.message.slice(0, 40));
            }
        }
    });
}

console.log('\u2500\u2500 Graph function eval checks \u2500\u2500\n');
if (issues.length) issues.forEach(function(v) { console.log('  ! ' + v); });

test('Graph functions checked: ' + graphsChecked, graphsChecked >= 10);
test('All graph functions are valid JS expressions', issues.length === 0);

console.log('\n' + '='.repeat(50));
console.log('rp-graph-function-eval: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
