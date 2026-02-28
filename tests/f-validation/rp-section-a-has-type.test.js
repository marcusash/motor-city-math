// rp-section-a-has-type test
// All Section A questions must have a type field (exponential/quadratic/etc)
// Section A is the "identify the parent function" section

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} rp-section-a-has-type.test.js\n');

var dataDir = path.join(__dirname, '../../data');
var missing = [], total = 0;

for (var i = 1; i <= 11; i++) {
    var f = path.join(dataDir, 'retake-practice-' + i + '.json');
    if (!fs.existsSync(f)) continue;
    var rp = JSON.parse(fs.readFileSync(f, 'utf-8'));
    (rp.questions || []).forEach(function(q) {
        if (q.section !== 'A') return;
        total++;
        if (!q.type || q.type.trim() === '') {
            missing.push('rp' + i + ' ' + q.id + ': missing type field');
        }
    });
}

console.log('\u2500\u2500 Section A type field checks \u2500\u2500\n');
if (missing.length) missing.forEach(function(v) { console.log('  ! ' + v); });

test('All ' + total + ' Section A questions have a type field', missing.length === 0);

console.log('\n' + '='.repeat(50));
console.log('rp-section-a-has-type: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
