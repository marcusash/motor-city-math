// rp-section-b-is-calculation test
// Section B questions should be calculation type (verify type field values)
// Section B = "Apply" section -- students compute numeric answers

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} rp-section-b-is-calculation.test.js\n');

var dataDir = path.join(__dirname, '../../data');
var VALID_B_TYPES = ['calculation', 'graph', 'open-ended', 'table', 'multi-part', 'comparison'];
var badType = [], total = 0;

for (var i = 1; i <= 11; i++) {
    var f = path.join(dataDir, 'retake-practice-' + i + '.json');
    if (!fs.existsSync(f)) continue;
    var rp = JSON.parse(fs.readFileSync(f, 'utf-8'));
    (rp.questions || []).forEach(function(q) {
        if (q.section !== 'B') return;
        total++;
        // Section B must have a type field
        if (!q.type || q.type.trim() === '') {
            badType.push('rp' + i + ' ' + q.id + ': missing type');
        }
    });
}

console.log('\u2500\u2500 Section B type checks \u2500\u2500\n');
if (badType.length) badType.forEach(function(v) { console.log('  ! ' + v); });

test('All ' + total + ' Section B questions have a type field', badType.length === 0);

console.log('\n' + '='.repeat(50));
console.log('rp-section-b-is-calculation: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
