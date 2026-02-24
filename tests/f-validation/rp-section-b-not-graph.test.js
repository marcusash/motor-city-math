// rp-section-b-not-graph test
// Section B questions must NOT be type=graph
// Section B is calculation -- graphs belong in Section C

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} rp-section-b-not-graph.test.js\n');

var dataDir = path.join(__dirname, '../../data');
var violations = [], sectionBCount = 0;

for (var i = 1; i <= 11; i++) {
    var f = path.join(dataDir, 'retake-practice-' + i + '.json');
    if (!fs.existsSync(f)) continue;
    var rp = JSON.parse(fs.readFileSync(f, 'utf-8'));
    (rp.questions || []).filter(function(q){ return q.section === 'B'; }).forEach(function(q) {
        sectionBCount++;
        if (q.type === 'graph' && q.graph && q.graph.function) {
            violations.push('rp' + i + ' ' + q.id + ': Section B is graph type (unexpected)');
        }
    });
}

console.log('\u2500\u2500 Section B no-graph checks \u2500\u2500\n');
if (violations.length) violations.forEach(function(v) { console.log('  ! ' + v); });

test('Section B questions checked: ' + sectionBCount, sectionBCount >= 88);
test('No Section B questions are graph type', violations.length === 0);

console.log('\n' + '='.repeat(50));
console.log('rp-section-b-not-graph: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
