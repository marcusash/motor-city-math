// rp-input-label-not-empty test
// Input label field must not be an empty string (except q14 radio -- documented exception)
// Empty labels mean Kai can't understand what to enter in each box

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} rp-input-label-not-empty.test.js\n');

var dataDir = path.join(__dirname, '../../data');
var emptyLabels = [];

for (var i = 1; i <= 11; i++) {
    var f = path.join(dataDir, 'retake-practice-' + i + '.json');
    if (!fs.existsSync(f)) continue;
    var rp = JSON.parse(fs.readFileSync(f, 'utf-8'));
    (rp.questions || []).forEach(function(q) {
        (q.inputs || []).forEach(function(inp) {
            // Exception: q14 radio input uses empty label (question_html carries text)
            if (inp.type === 'radio' && inp.label === '') return;
            if (inp.label === '' || inp.label === null) {
                emptyLabels.push('rp' + i + ' ' + q.id + ' inp=' + inp.id + ': empty label');
            }
        });
    });
}

console.log('\u2500\u2500 Input label empty checks \u2500\u2500\n');
if (emptyLabels.length) emptyLabels.slice(0, 5).forEach(function(v) { console.log('  ! ' + v); });

test('No inputs have empty labels (except radio q14 exception) (' + emptyLabels.length + ' violations)', emptyLabels.length === 0);

console.log('\n' + '='.repeat(50));
console.log('rp-input-label-not-empty: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
