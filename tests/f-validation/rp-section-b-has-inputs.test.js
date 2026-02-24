// rp-section-b-has-inputs test
// All Section B questions (8 questions each) must have at least 1 input
// Section B = calculation work -- every question needs an answer field

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} rp-section-b-has-inputs.test.js\n');

var dataDir = path.join(__dirname, '../../data');
var noInputs = [], total = 0;

for (var i = 1; i <= 11; i++) {
    var f = path.join(dataDir, 'retake-practice-' + i + '.json');
    if (!fs.existsSync(f)) continue;
    var rp = JSON.parse(fs.readFileSync(f, 'utf-8'));
    (rp.questions || []).forEach(function(q) {
        if (q.section !== 'B') return;
        total++;
        if (!q.inputs || q.inputs.length === 0) {
            noInputs.push('rp' + i + ' ' + q.id + ': no inputs');
        }
    });
}

console.log('\u2500\u2500 Section B input checks \u2500\u2500\n');
if (noInputs.length) noInputs.forEach(function(v) { console.log('  ! ' + v); });

test('All ' + total + ' Section B questions have inputs', noInputs.length === 0);

console.log('\n' + '='.repeat(50));
console.log('rp-section-b-has-inputs: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
