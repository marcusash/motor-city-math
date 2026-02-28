// rp-input-label-nonempty test
// All input label fields must be non-empty strings
// Empty labels mean Kai sees blank form labels and can't understand what to enter

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} rp-input-label-nonempty.test.js\n');

var dataDir = path.join(__dirname, '../../data');
var empty = [], total = 0;

for (var i = 1; i <= 11; i++) {
    var f = path.join(dataDir, 'retake-practice-' + i + '.json');
    if (!fs.existsSync(f)) continue;
    var rp = JSON.parse(fs.readFileSync(f, 'utf-8'));
    (rp.questions || []).forEach(function(q) {
        (q.inputs || []).forEach(function(inp) {
            total++;
            var lbl = inp.label;
            // Radio inputs may have empty label -- question_html carries the text
            if (inp.type === 'radio' && (lbl === '' || lbl === undefined)) return;
            if (lbl === undefined || lbl === null) {
                empty.push('rp' + i + ' ' + q.id + '.' + inp.id + ': label is missing');
            } else if (typeof lbl !== 'string' || lbl.trim().length === 0) {
                empty.push('rp' + i + ' ' + q.id + '.' + inp.id + ': label is empty string');
            }
        });
    });
}

console.log('\u2500\u2500 Input label checks \u2500\u2500\n');
if (empty.length) empty.slice(0, 5).forEach(function(v) { console.log('  ! ' + v); });

test('All ' + total + ' input labels are non-empty strings', empty.length === 0);

console.log('\n' + '='.repeat(50));
console.log('rp-input-label-nonempty: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
