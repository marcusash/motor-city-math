// rp-graph-function-no-leading-space test
// Graph function strings should not have leading/trailing whitespace
// which could cause function evaluation to fail silently

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} rp-graph-function-no-leading-space.test.js\n');

var dataDir = path.join(__dirname, '../../data');
var violations = [];
var checked = 0;

for (var i = 1; i <= 11; i++) {
    var f = path.join(dataDir, 'retake-practice-' + i + '.json');
    if (!fs.existsSync(f)) continue;
    var rp = JSON.parse(fs.readFileSync(f, 'utf-8'));
    (rp.questions || []).forEach(function(q) {
        if (!q.graph) return;
        var fn = q.graph['function'] || q.graph.fn || q.graph.equation;
        if (!fn) return;
        checked++;
        if (fn !== fn.trim()) {
            violations.push('rp' + i + ' ' + q.id + ': graph function has leading/trailing whitespace: "' + fn + '"');
        }
    });
}

console.log('\u2500\u2500 Graph function whitespace checks \u2500\u2500\n');
if (violations.length) violations.forEach(function(v) { console.log('  ! ' + v); });
console.log('  Graph functions checked: ' + checked);

test('No graph function strings have leading/trailing whitespace (' + violations.length + ' violations)', violations.length === 0);

console.log('\n' + '='.repeat(50));
console.log('rp-graph-function-no-leading-space: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
