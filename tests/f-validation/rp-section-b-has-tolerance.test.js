// rp-section-b-has-tolerance test
// All numeric inputs in Section B must have a tolerance defined (>= 0)

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} rp-section-b-has-tolerance.test.js\n');

var dataDir = path.join(__dirname, '../../data');
var violations = [];
var checked = 0;

for (var i = 1; i <= 11; i++) {
    var f = path.join(dataDir, 'retake-practice-' + i + '.json');
    if (!fs.existsSync(f)) continue;
    var rp = JSON.parse(fs.readFileSync(f, 'utf-8'));
    (rp.questions || []).filter(function(q) { return q.section === 'B'; }).forEach(function(q) {
        (q.inputs || []).forEach(function(inp) {
            if (inp.type === 'number') {
                checked++;
                if (inp.tolerance === undefined || inp.tolerance === null) {
                    violations.push('rp' + i + ' ' + q.id + ' input=' + inp.id + ': missing tolerance');
                }
            }
        });
    });
}

console.log('\u2500\u2500 Section B numeric tolerance checks \u2500\u2500\n');
if (violations.length) violations.forEach(function(v) { console.log('  ! ' + v); });
console.log('  Numeric inputs in section B checked: ' + checked);

test('All section B numeric inputs have tolerance (' + violations.length + ' violations)', violations.length === 0);

console.log('\n' + '='.repeat(50));
console.log('rp-section-b-has-tolerance: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
