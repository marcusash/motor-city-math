// rp-question-section-field-exists test
// Every question must have a 'section' field (A, B, C, or D)
// Missing section field breaks the renderer's question categorization

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} rp-question-section-field-exists.test.js\n');

var dataDir = path.join(__dirname, '../../data');
var violations = [];
var checked = 0;

for (var i = 1; i <= 11; i++) {
    var f = path.join(dataDir, 'retake-practice-' + i + '.json');
    if (!fs.existsSync(f)) continue;
    var rp = JSON.parse(fs.readFileSync(f, 'utf-8'));
    (rp.questions || []).forEach(function(q) {
        checked++;
        if (!q.section || ['A','B','C','D'].indexOf(q.section) === -1) {
            violations.push('rp' + i + ' ' + q.id + ': invalid section=' + q.section);
        }
    });
}

console.log('\u2500\u2500 Section field presence checks \u2500\u2500\n');
if (violations.length) violations.forEach(function(v) { console.log('  ! ' + v); });
console.log('  Questions checked: ' + checked);

test('All questions have a valid section field (A/B/C/D) (' + violations.length + ' violations)', violations.length === 0);

console.log('\n' + '='.repeat(50));
console.log('rp-question-section-field-exists: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
