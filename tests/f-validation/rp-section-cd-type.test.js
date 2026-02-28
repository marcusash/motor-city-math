// rp-section-c-d-type test
// Sections C and D questions must have type fields
// These sections cover graphing and open-ended analysis

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} rp-section-cd-type.test.js\n');

var dataDir = path.join(__dirname, '../../data');
var missingC = [], missingD = [], totalC = 0, totalD = 0;

for (var i = 1; i <= 11; i++) {
    var f = path.join(dataDir, 'retake-practice-' + i + '.json');
    if (!fs.existsSync(f)) continue;
    var rp = JSON.parse(fs.readFileSync(f, 'utf-8'));
    (rp.questions || []).forEach(function(q) {
        if (q.section === 'C') {
            totalC++;
            if (!q.type || q.type.trim() === '') missingC.push('rp' + i + ' ' + q.id);
        }
        if (q.section === 'D') {
            totalD++;
            if (!q.type || q.type.trim() === '') missingD.push('rp' + i + ' ' + q.id);
        }
    });
}

console.log('\u2500\u2500 Section C/D type field checks \u2500\u2500\n');
if (missingC.length) missingC.forEach(function(v) { console.log('  ! Section C missing type: ' + v); });
if (missingD.length) missingD.forEach(function(v) { console.log('  ! Section D missing type: ' + v); });

test('All ' + totalC + ' Section C questions have type field', missingC.length === 0);
test('All ' + totalD + ' Section D questions have type field', missingD.length === 0);

console.log('\n' + '='.repeat(50));
console.log('rp-section-cd-type: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
