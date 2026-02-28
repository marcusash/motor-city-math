// rp-section-field-valid test
// All questions must have a section field with value A, B, C, or D
// Invalid section values break score-by-section analytics

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} rp-section-field-valid.test.js\n');

var dataDir = path.join(__dirname, '../../data');
var invalid = [], total = 0;
var VALID_SECTIONS = ['A', 'B', 'C', 'D'];

for (var i = 1; i <= 11; i++) {
    var f = path.join(dataDir, 'retake-practice-' + i + '.json');
    if (!fs.existsSync(f)) continue;
    var rp = JSON.parse(fs.readFileSync(f, 'utf-8'));
    (rp.questions || []).forEach(function(q) {
        total++;
        if (VALID_SECTIONS.indexOf(q.section) === -1) {
            invalid.push('rp' + i + ' ' + q.id + ': section="' + q.section + '"');
        }
    });
}

console.log('\u2500\u2500 Section field validity checks \u2500\u2500\n');
if (invalid.length) invalid.forEach(function(v) { console.log('  ! ' + v); });

test('All ' + total + ' questions have valid section (A/B/C/D)', invalid.length === 0);

console.log('\n' + '='.repeat(50));
console.log('rp-section-field-valid: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
