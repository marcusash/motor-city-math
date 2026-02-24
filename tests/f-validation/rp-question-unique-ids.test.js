// rp-question-unique-ids test
// All question IDs within a single RP exam must be unique
// Duplicate IDs cause grading collisions and answer tracking bugs

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} rp-question-unique-ids.test.js\n');

var dataDir = path.join(__dirname, '../../data');

console.log('\u2500\u2500 Question ID uniqueness checks \u2500\u2500\n');

var allGood = true;
for (var i = 1; i <= 11; i++) {
    var f = path.join(dataDir, 'retake-practice-' + i + '.json');
    if (!fs.existsSync(f)) continue;
    var rp = JSON.parse(fs.readFileSync(f, 'utf-8'));
    var ids = (rp.questions || []).map(function(q) { return q.id; });
    var seen = {};
    var dups = ids.filter(function(id) {
        if (seen[id]) return true;
        seen[id] = true;
        return false;
    });
    if (dups.length > 0) {
        console.log('  ! rp' + i + ' duplicate IDs: ' + dups.join(', '));
        allGood = false;
    }
    var count = (rp.questions || []).length;
    test('rp' + i + ': all ' + count + ' question IDs unique', dups.length === 0);
}

console.log('\n' + '='.repeat(50));
console.log('rp-question-unique-ids: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
