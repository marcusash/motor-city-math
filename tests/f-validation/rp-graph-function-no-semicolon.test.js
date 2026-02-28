// rp-graph-function-no-semicolon test
// Graph function strings must not contain semicolons
// Semicolons in new Function('x', 'return ' + fn) break execution

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} rp-graph-function-no-semicolon.test.js\n');

var dataDir = path.join(__dirname, '../../data');
var violations = [], graphCount = 0;

for (var i = 1; i <= 11; i++) {
    var f = path.join(dataDir, 'retake-practice-' + i + '.json');
    if (!fs.existsSync(f)) continue;
    var rp = JSON.parse(fs.readFileSync(f, 'utf-8'));
    (rp.questions || []).filter(function(q){ return q.graph && q.graph.function; }).forEach(function(q) {
        graphCount++;
        var fn = q.graph.function;
        if (fn.includes(';')) {
            violations.push('rp' + i + ' ' + q.id + ': function has semicolon: "' + fn + '"');
        }
    });
}

console.log('\u2500\u2500 Graph function semicolon checks \u2500\u2500\n');
if (violations.length) violations.forEach(function(v) { console.log('  ! ' + v); });

test('Graph functions checked: ' + graphCount, graphCount >= 22);
test('No semicolons in graph function strings', violations.length === 0);

console.log('\n' + '='.repeat(50));
console.log('rp-graph-function-no-semicolon: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
