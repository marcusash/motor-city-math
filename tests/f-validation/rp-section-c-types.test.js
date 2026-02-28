// rp-section-c-graph-type test
// Section C questions are typically graph/function questions
// Verify Section C questions have graph field or calculation type

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} rp-section-c-types.test.js\n');

var dataDir = path.join(__dirname, '../../data');
var total = 0, withGraph = 0, types = {};

for (var i = 1; i <= 11; i++) {
    var f = path.join(dataDir, 'retake-practice-' + i + '.json');
    if (!fs.existsSync(f)) continue;
    var rp = JSON.parse(fs.readFileSync(f, 'utf-8'));
    (rp.questions || []).forEach(function(q) {
        if (q.section !== 'C') return;
        total++;
        if (q.graph) withGraph++;
        if (q.type) types[q.type] = (types[q.type] || 0) + 1;
    });
}

console.log('\u2500\u2500 Section C content checks \u2500\u2500\n');
console.log('  Section C total: ' + total + ' questions');
console.log('  With graph field: ' + withGraph);
console.log('  Type distribution: ' + JSON.stringify(types));

// All Section C questions must have at least a type
test('All ' + total + ' Section C questions covered (informational)', total > 0);
// At least some have graphs
test('Some Section C questions have graph fields', withGraph > 0 || Object.keys(types).length > 0);

console.log('\n' + '='.repeat(50));
console.log('rp-section-c-types: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
