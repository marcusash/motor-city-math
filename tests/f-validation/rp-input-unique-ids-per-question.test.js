// rp-input-unique-ids-per-question test
// Within each question, all input IDs must be unique
// Duplicate input IDs cause grading logic to read wrong values

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} rp-input-unique-ids-per-question.test.js\n');

var dataDir = path.join(__dirname, '../../data');
var dups = [], total = 0;

for (var i = 1; i <= 11; i++) {
    var f = path.join(dataDir, 'retake-practice-' + i + '.json');
    if (!fs.existsSync(f)) continue;
    var rp = JSON.parse(fs.readFileSync(f, 'utf-8'));
    (rp.questions || []).forEach(function(q) {
        var ids = (q.inputs || []).map(function(inp) { return inp.id; });
        total++;
        var seen = {};
        ids.forEach(function(id) {
            if (seen[id]) dups.push('rp' + i + ' ' + q.id + ' dup input id: ' + id);
            seen[id] = true;
        });
    });
}

console.log('\u2500\u2500 Input ID uniqueness checks \u2500\u2500\n');
if (dups.length) dups.forEach(function(v) { console.log('  ! ' + v); });

test('All ' + total + ' questions have unique input IDs', dups.length === 0);

console.log('\n' + '='.repeat(50));
console.log('rp-input-unique-ids-per-question: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
