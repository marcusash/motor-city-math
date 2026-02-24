// rp-multiple-choice-options-count test
// Section D radio questions (q14) should have exactly 4 options (A/B/C/D)
// Standard multiple-choice: exactly 4 options per question

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} rp-multiple-choice-options-count.test.js\n');

var dataDir = path.join(__dirname, '../../data');
var wrong = [], checked = 0;

for (var i = 1; i <= 11; i++) {
    var f = path.join(dataDir, 'retake-practice-' + i + '.json');
    if (!fs.existsSync(f)) continue;
    var rp = JSON.parse(fs.readFileSync(f, 'utf-8'));
    (rp.questions || []).forEach(function(q) {
        // options are in q.inputs[].options where inputs[].type === 'radio'
        (q.inputs || []).forEach(function(inp) {
            if (inp.type !== 'radio') return;
            var opts = inp.options || [];
            checked++;
            if (opts.length !== 4) {
                wrong.push('rp' + i + ' ' + q.id + ': ' + opts.length + ' options (expected 4)');
            }
        });
    });
}

console.log('\u2500\u2500 Radio options count checks \u2500\u2500\n');
if (wrong.length) wrong.forEach(function(v) { console.log('  ! ' + v); });

test('Radio questions checked: ' + checked, checked >= 5);
test('All radio questions have exactly 4 options', wrong.length === 0);

console.log('\n' + '='.repeat(50));
console.log('rp-multiple-choice-options-count: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
