// rp-multi-input-ids-unique test
// When a question has multiple inputs, each must have a unique id
// Duplicate IDs cause DOM and grading collisions

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} rp-multi-input-ids-unique.test.js\n');

var dataDir = path.join(__dirname, '../../data');
var dupIds = [], questionsChecked = 0;

for (var i = 1; i <= 11; i++) {
    var f = path.join(dataDir, 'retake-practice-' + i + '.json');
    if (!fs.existsSync(f)) continue;
    var rp = JSON.parse(fs.readFileSync(f, 'utf-8'));
    (rp.questions || []).forEach(function(q) {
        var inputs = q.inputs || [];
        if (inputs.length > 1) {
            questionsChecked++;
            var ids = inputs.map(function(inp) { return inp.id; });
            var unique = new Set(ids);
            if (unique.size !== ids.length) {
                dupIds.push('rp' + i + ' ' + q.id + ': duplicate input ids: ' + ids.join(', '));
            }
        }
    });
}

console.log('\u2500\u2500 Multi-input ID uniqueness checks \u2500\u2500\n');
if (dupIds.length) dupIds.forEach(function(v) { console.log('  ! ' + v); });

test('Multi-input questions checked: ' + questionsChecked, questionsChecked > 0);
test('All multi-input questions have unique IDs', dupIds.length === 0);

console.log('\n' + '='.repeat(50));
console.log('rp-multi-input-ids-unique: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
