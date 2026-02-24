// rp-section-ids-valid test
// Every question's section ID must be A, B, C, or D

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} rp-section-ids-valid.test.js\n');

var dataDir = path.join(__dirname, '../../data');
var VALID = new Set(['A', 'B', 'C', 'D']);
var violations = [];
var total = 0;

for (var i = 1; i <= 11; i++) {
    var f = path.join(dataDir, 'retake-practice-' + i + '.json');
    if (!fs.existsSync(f)) continue;
    var rp = JSON.parse(fs.readFileSync(f, 'utf-8'));
    (rp.questions || []).forEach(function(q) {
        total++;
        if (!VALID.has(q.section)) {
            violations.push('rp' + i + ' ' + q.id + ': section="' + q.section + '"');
        }
    });
}

console.log('\u2500\u2500 Section ID validation \u2500\u2500\n');
if (violations.length) violations.forEach(function(v) { console.log('  ! ' + v); });
console.log('  Total questions checked: ' + total);

test('All question sections are A/B/C/D (' + violations.length + ' violations)', violations.length === 0);

console.log('\n' + '='.repeat(50));
console.log('rp-section-ids-valid: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
