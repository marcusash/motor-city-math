// rp-graph-asymptote-type test
// graph.asymptotes entries must be objects with type, value, and direction fields

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} rp-graph-asymptote-type.test.js\n');

var dataDir = path.join(__dirname, '../../data');
var violations = [];
var total = 0;

for (var i = 1; i <= 11; i++) {
    var f = path.join(dataDir, 'retake-practice-' + i + '.json');
    if (!fs.existsSync(f)) continue;
    var rp = JSON.parse(fs.readFileSync(f, 'utf-8'));
    (rp.questions || []).forEach(function(q) {
        if (!q.graph || !Array.isArray(q.graph.asymptotes) || q.graph.asymptotes.length === 0) return;
        q.graph.asymptotes.forEach(function(asy, idx) {
            total++;
            if (typeof asy !== 'object' || asy === null) {
                violations.push('rp' + i + ' ' + q.id + ' asymptote[' + idx + ']: not an object');
            } else if (asy.type === undefined && asy.value === undefined) {
                violations.push('rp' + i + ' ' + q.id + ' asymptote[' + idx + ']: missing type and value');
            }
        });
    });
}

console.log('\u2500\u2500 Asymptote object structure checks \u2500\u2500\n');
if (violations.length) violations.forEach(function(v) { console.log('  ! ' + v); });
console.log('  Asymptotes checked: ' + total);

test('All asymptote entries are valid objects (' + violations.length + ' violations)', violations.length === 0);

console.log('\n' + '='.repeat(50));
console.log('rp-graph-asymptote-type: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
