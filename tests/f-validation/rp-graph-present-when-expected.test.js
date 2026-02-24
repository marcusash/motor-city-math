// rp-graph-present-when-expected test
// Questions with "graph" keyword in question_html should have a graph field

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} rp-graph-present-when-expected.test.js\n');

var dataDir = path.join(__dirname, '../../data');
var violations = [];
var total = 0;

for (var i = 1; i <= 11; i++) {
    var f = path.join(dataDir, 'retake-practice-' + i + '.json');
    if (!fs.existsSync(f)) continue;
    var rp = JSON.parse(fs.readFileSync(f, 'utf-8'));
    (rp.questions || []).forEach(function(q) {
        var html = (q.question_html || '').toLowerCase();
        // Questions that say "use the graph" or "graph below" imply graph field required
        var expectsGraph = /the graph (below|above|shown|provided)|use the graph|from the graph/i.test(q.question_html || '');
        if (!expectsGraph) return;
        total++;
        if (!q.graph) {
            violations.push('rp' + i + ' ' + q.id + ': question references graph but has no graph field');
        }
    });
}

console.log('\u2500\u2500 Graph field presence checks \u2500\u2500\n');
if (violations.length) violations.forEach(function(v) { console.log('  ! ' + v); });
console.log('  Questions referencing graph: ' + total);

test('All graph-referencing questions have graph field (' + violations.length + ' violations)', violations.length === 0);

console.log('\n' + '='.repeat(50));
console.log('rp-graph-present-when-expected: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
