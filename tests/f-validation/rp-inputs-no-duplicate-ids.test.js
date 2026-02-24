// rp-inputs-no-duplicate-ids test
// Input IDs within a single RP exam must be unique (no two inputs share an id)
// Duplicate IDs break JavaScript querySelector and HTML form submission

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} rp-inputs-no-duplicate-ids.test.js\n');

var dataDir = path.join(__dirname, '../../data');
var dupes = [], checked = 0;

for (var i = 1; i <= 11; i++) {
    var f = path.join(dataDir, 'retake-practice-' + i + '.json');
    if (!fs.existsSync(f)) continue;
    var rp = JSON.parse(fs.readFileSync(f, 'utf-8'));
    var seen = {};
    (rp.questions || []).forEach(function(q) {
        (q.inputs || []).forEach(function(inp) {
            if (!inp.id) return;
            checked++;
            if (seen[inp.id]) {
                dupes.push('rp' + i + ': duplicate input id "' + inp.id + '"');
            } else {
                seen[inp.id] = true;
            }
        });
    });
}

console.log('\u2500\u2500 Input ID uniqueness checks \u2500\u2500\n');
if (dupes.length) dupes.forEach(function(v) { console.log('  ! ' + v); });

test('Total inputs checked: ' + checked, checked >= 165);
test('All input IDs unique within each exam', dupes.length === 0);

console.log('\n' + '='.repeat(50));
console.log('rp-inputs-no-duplicate-ids: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
