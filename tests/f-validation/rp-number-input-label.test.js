// rp-input-label-meaningful test
// Number input labels must not be empty or just whitespace
// Radio inputs may have empty label (the question_html carries the text)

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} rp-number-input-label.test.js\n');

var dataDir = path.join(__dirname, '../../data');
var emptyLabel = [], total = 0;

for (var i = 1; i <= 11; i++) {
    var f = path.join(dataDir, 'retake-practice-' + i + '.json');
    if (!fs.existsSync(f)) continue;
    var rp = JSON.parse(fs.readFileSync(f, 'utf-8'));
    (rp.questions || []).forEach(function(q) {
        (q.inputs || []).forEach(function(inp) {
            if (inp.type === 'radio') return; // radio empty label is OK per schema
            total++;
            if (inp.label === undefined || inp.label === null || inp.label.trim() === '') {
                emptyLabel.push('rp' + i + ' ' + q.id + ' inp=' + inp.id + ' type=' + inp.type + ': empty label');
            }
        });
    });
}

console.log('\u2500\u2500 Number input label checks \u2500\u2500\n');
if (emptyLabel.length) emptyLabel.slice(0, 5).forEach(function(v) { console.log('  ! ' + v); });

test('All ' + total + ' non-radio inputs have meaningful labels', emptyLabel.length === 0);

console.log('\n' + '='.repeat(50));
console.log('rp-number-input-label: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
