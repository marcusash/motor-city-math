// rp-options-count-4 test
// Section A (radio) questions typically have 4 answer choices

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} rp-options-count-4.test.js\n');

var dataDir = path.join(__dirname, '../../data');
var violations = [];
var total = 0;

for (var i = 1; i <= 11; i++) {
    var f = path.join(dataDir, 'retake-practice-' + i + '.json');
    if (!fs.existsSync(f)) continue;
    var rp = JSON.parse(fs.readFileSync(f, 'utf-8'));
    (rp.questions || []).forEach(function(q) {
        if (q.section !== 'A') return;
        (q.inputs || []).forEach(function(inp) {
            if (inp.type !== 'radio') return;
            total++;
            var count = (inp.options || []).length;
            if (count !== 4) {
                violations.push('rp' + i + ' ' + q.id + '/' + inp.id + ': ' + count + ' options (expected 4)');
            }
        });
    });
}

console.log('\u2500\u2500 Section A radio option count checks \u2500\u2500\n');
if (violations.length) violations.forEach(function(v) { console.log('  ! ' + v); });
console.log('  Radio inputs checked: ' + total);

test('All Section A radio inputs have exactly 4 options (' + violations.length + ' violations)', violations.length === 0);

console.log('\n' + '='.repeat(50));
console.log('rp-options-count-4: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
