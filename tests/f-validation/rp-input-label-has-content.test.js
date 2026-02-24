// rp-input-label-has-content test
// Every input must have a non-empty label field to describe what Kai should enter
// Empty labels leave him guessing what the field is for

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} rp-input-label-has-content.test.js\n');

var dataDir = path.join(__dirname, '../../data');
var violations = [];
var checked = 0;

for (var i = 1; i <= 11; i++) {
    var f = path.join(dataDir, 'retake-practice-' + i + '.json');
    if (!fs.existsSync(f)) continue;
    var rp = JSON.parse(fs.readFileSync(f, 'utf-8'));
    (rp.questions || []).forEach(function(q) {
        (q.inputs || []).forEach(function(inp) {
            // Radio inputs often have no label (question_html is the label context)
            if (inp.type === 'radio') return;
            checked++;
            if (!inp.label || inp.label.trim().length < 2) {
                violations.push('rp' + i + ' ' + q.id + ' ' + inp.id + ': label="' + inp.label + '"');
            }
        });
    });
}

console.log('\u2500\u2500 Input label content checks \u2500\u2500\n');
if (violations.length) violations.slice(0, 5).forEach(function(v) { console.log('  ! ' + v); });
if (violations.length > 5) console.log('  ... and ' + (violations.length - 5) + ' more');
console.log('  Inputs checked: ' + checked);

test('All inputs have non-empty label content (' + violations.length + ' violations)', violations.length === 0);

console.log('\n' + '='.repeat(50));
console.log('rp-input-label-has-content: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
