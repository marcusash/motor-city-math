// rp-section-c-has-graph test
// Section C should contain graph questions requiring coordinate work
// Graph questions test deepest understanding of function behavior
// (Section D has word problems and write-equation)

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} rp-section-d-has-graph.test.js\n');

var dataDir = path.join(__dirname, '../../data');
var noGraph = [], examsChecked = 0;

for (var i = 1; i <= 11; i++) {
    var f = path.join(dataDir, 'retake-practice-' + i + '.json');
    if (!fs.existsSync(f)) continue;
    var rp = JSON.parse(fs.readFileSync(f, 'utf-8'));
    examsChecked++;
    var sectionC = (rp.questions || []).filter(function(q) { return q.section === 'C'; });
    var hasGraph = sectionC.some(function(q) { return q.type === 'graph'; });
    if (!hasGraph) {
        var types = sectionC.map(function(q) { return q.type; }).join(', ');
        noGraph.push('rp' + i + ': Section C has no graph (has: ' + types + ')');
    }
}

console.log('\u2500\u2500 Section D graph checks \u2500\u2500\n');
if (noGraph.length) noGraph.forEach(function(v) { console.log('  INFO: ' + v); });

test('All exams checked (' + examsChecked + '/11)', examsChecked === 11);
// Most exams should have graph in Section D (allow up to 3 exceptions)
test('Most exams have graph in Section C (>= 8/11)', (examsChecked - noGraph.length) >= 8);

console.log('\n' + '='.repeat(50));
console.log('rp-section-c-has-graph: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
