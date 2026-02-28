// rp-section-d-no-graph test
// Section D questions must NOT have graph data
// Section D is word problems and multiple choice -- not graphing

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} rp-section-d-no-graph.test.js\n');

var dataDir = path.join(__dirname, '../../data');
var violations = [], sectionDCount = 0;

for (var i = 1; i <= 11; i++) {
    var f = path.join(dataDir, 'retake-practice-' + i + '.json');
    if (!fs.existsSync(f)) continue;
    var rp = JSON.parse(fs.readFileSync(f, 'utf-8'));
    (rp.questions || []).filter(function(q){ return q.section === 'D'; }).forEach(function(q) {
        sectionDCount++;
        if (q.graph && q.graph.function) {
            violations.push('rp' + i + ' ' + q.id + ': Section D has graph data (unexpected)');
        }
    });
}

console.log('\u2500\u2500 Section D no-graph checks \u2500\u2500\n');
if (violations.length) violations.forEach(function(v) { console.log('  ! ' + v); });

test('Section D questions checked: ' + sectionDCount, sectionDCount >= 22);
test('No Section D questions have graph data', violations.length === 0);

console.log('\n' + '='.repeat(50));
console.log('rp-section-d-no-graph: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
