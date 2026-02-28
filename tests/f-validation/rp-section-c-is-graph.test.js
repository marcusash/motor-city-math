// rp-section-c-is-graph test
// Section C questions should be of type 'graph' or 'graph-plot'
// Section C is the graph plotting section per the RP schema spec

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} rp-section-c-is-graph.test.js\n');

var dataDir = path.join(__dirname, '../../data');
var violations = [];
var checked = 0;

for (var i = 1; i <= 11; i++) {
    var f = path.join(dataDir, 'retake-practice-' + i + '.json');
    if (!fs.existsSync(f)) continue;
    var rp = JSON.parse(fs.readFileSync(f, 'utf-8'));
    (rp.questions || []).filter(function(q) { return q.section === 'C'; }).forEach(function(q) {
        checked++;
        if (!q.graph) {
            violations.push('rp' + i + ' ' + q.id + ': section C question has no graph field');
        }
    });
}

console.log('\u2500\u2500 Section C graph field checks \u2500\u2500\n');
if (violations.length) violations.forEach(function(v) { console.log('  ! ' + v); });
console.log('  Section C questions checked: ' + checked);

test('All section C questions have a graph field (' + violations.length + ' violations)', violations.length === 0);

console.log('\n' + '='.repeat(50));
console.log('rp-section-c-is-graph: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
