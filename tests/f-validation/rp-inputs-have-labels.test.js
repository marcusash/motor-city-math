// rp-inputs-have-labels test
// Every input in every RP question must have a label field
// Missing labels = Kai sees no field description on screen

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} rp-inputs-have-labels.test.js\n');

var dataDir = path.join(__dirname, '../../data');
var missingLabels = [], totalInputs = 0;

for (var i = 1; i <= 11; i++) {
    var f = path.join(dataDir, 'retake-practice-' + i + '.json');
    if (!fs.existsSync(f)) continue;
    var rp = JSON.parse(fs.readFileSync(f, 'utf-8'));
    (rp.questions || []).forEach(function(q) {
        (q.inputs || []).forEach(function(inp) {
            totalInputs++;
            // radio/multiple-choice: label can be empty (options provide full context)
            var isOptional = inp.type === 'radio' || inp.type === 'multiple-choice';
            if (!isOptional && (!inp.label || inp.label.trim() === '')) {
                missingLabels.push('rp' + i + ' ' + q.id + ' ' + inp.id + ': missing label');
            }
        });
    });
}

console.log('\u2500\u2500 Input label checks \u2500\u2500\n');
if (missingLabels.length) missingLabels.slice(0, 5).forEach(function(v) { console.log('  ! ' + v); });
if (missingLabels.length > 5) console.log('  ... and ' + (missingLabels.length - 5) + ' more');

test('Total inputs checked: ' + totalInputs, totalInputs >= 200);
test('All inputs have label field', missingLabels.length === 0);

console.log('\n' + '='.repeat(50));
console.log('rp-inputs-have-labels: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
