// rp-input-id-prefix test
// All input IDs in RP exams must start with 'q' (e.g., q1a, q2b)
// Non-prefixed IDs could clash with other DOM element IDs in exam.html

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} rp-input-id-prefix.test.js\n');

var dataDir = path.join(__dirname, '../../data');
var bad = [], total = 0;

for (var i = 1; i <= 11; i++) {
    var f = path.join(dataDir, 'retake-practice-' + i + '.json');
    if (!fs.existsSync(f)) continue;
    var rp = JSON.parse(fs.readFileSync(f, 'utf-8'));
    (rp.questions || []).forEach(function(q) {
        (q.inputs || []).forEach(function(inp) {
            total++;
            if (!inp.id || !inp.id.startsWith('q')) {
                bad.push('rp' + i + ' ' + q.id + ' inp.id="' + inp.id + '" (must start with q)');
            }
        });
    });
}

console.log('\u2500\u2500 Input ID prefix checks \u2500\u2500\n');
if (bad.length) bad.slice(0, 5).forEach(function(v) { console.log('  ! ' + v); });

test('All ' + total + ' input IDs start with "q"', bad.length === 0);

console.log('\n' + '='.repeat(50));
console.log('rp-input-id-prefix: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
