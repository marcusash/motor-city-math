// rp-input-id-unique-global test
// Input IDs must be globally unique across ALL questions in an exam
// Duplicate IDs cause the grader to match wrong inputs

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} rp-input-id-unique-global.test.js\n');

var dataDir = path.join(__dirname, '../../data');
var dupIds = [];

for (var i = 1; i <= 11; i++) {
    var f = path.join(dataDir, 'retake-practice-' + i + '.json');
    if (!fs.existsSync(f)) continue;
    var rp = JSON.parse(fs.readFileSync(f, 'utf-8'));
    var seen = {};
    (rp.questions || []).forEach(function(q) {
        (q.inputs || []).forEach(function(inp) {
            if (seen[inp.id]) {
                dupIds.push('rp' + i + ': input id "' + inp.id + '" duplicated on ' + q.id + ' and ' + seen[inp.id]);
            } else {
                seen[inp.id] = q.id;
            }
        });
    });
}

console.log('\u2500\u2500 Global input ID uniqueness checks \u2500\u2500\n');
if (dupIds.length) dupIds.slice(0, 5).forEach(function(v) { console.log('  ! ' + v); });

test('All input IDs are globally unique within each exam (' + dupIds.length + ' duplicates)', dupIds.length === 0);

console.log('\n' + '='.repeat(50));
console.log('rp-input-id-unique-global: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
