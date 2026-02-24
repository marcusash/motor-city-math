// rp-section-d-has-inputs test
// Section D questions (extended response) must have at least 1 input
// Free-response needs somewhere for Kai to enter an answer

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} rp-section-d-has-inputs.test.js\n');

var dataDir = path.join(__dirname, '../../data');
var noInputs = [];

for (var i = 1; i <= 11; i++) {
    var f = path.join(dataDir, 'retake-practice-' + i + '.json');
    if (!fs.existsSync(f)) continue;
    var rp = JSON.parse(fs.readFileSync(f, 'utf-8'));
    (rp.questions || []).forEach(function(q) {
        if (q.section !== 'D') return;
        if (!q.inputs || q.inputs.length === 0) {
            noInputs.push('rp' + i + ' ' + q.id + ': Section D with no inputs');
        }
    });
}

console.log('\u2500\u2500 Section D input checks \u2500\u2500\n');
if (noInputs.length) noInputs.forEach(function(v) { console.log('  ! ' + v); });

test('All Section D questions have at least 1 input (' + noInputs.length + ' violations)', noInputs.length === 0);

console.log('\n' + '='.repeat(50));
console.log('rp-section-d-has-inputs: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
