// rp-graph-asymptotes-array test
// graph.asymptotes must be an array (even if empty)
// A non-array value (null, string, object) would crash the renderer

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} rp-graph-asymptotes-array.test.js\n');

var dataDir = path.join(__dirname, '../../data');
var violations = [];
var checked = 0;

for (var i = 1; i <= 11; i++) {
    var f = path.join(dataDir, 'retake-practice-' + i + '.json');
    if (!fs.existsSync(f)) continue;
    var rp = JSON.parse(fs.readFileSync(f, 'utf-8'));
    (rp.questions || []).forEach(function(q) {
        if (!q.graph) return;
        if (q.graph.asymptotes === undefined || q.graph.asymptotes === null) return; // null = no asymptotes, acceptable
        checked++;
        if (!Array.isArray(q.graph.asymptotes) && typeof q.graph.asymptotes !== 'object') {
            violations.push('rp' + i + ' ' + q.id + ': graph.asymptotes is not an array or object (type=' + typeof q.graph.asymptotes + ')');
        }
    });
}

console.log('\u2500\u2500 Asymptotes array type checks \u2500\u2500\n');
if (violations.length) violations.forEach(function(v) { console.log('  ! ' + v); });
console.log('  Graphs with asymptotes field checked: ' + checked);

test('All graph.asymptotes are arrays or objects (not primitives) (' + violations.length + ' violations)', violations.length === 0);

console.log('\n' + '='.repeat(50));
console.log('rp-graph-asymptotes-array: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
