// RP exam ID uniqueness across all 11 exams
// No two questions across all exams should share the same id
// Duplicate IDs cause grading collisions and localStorage key collisions

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} rp-global-question-uniqueness.test.js\n');

var dataDir = path.join(__dirname, '../../data');
var allQuestionIds = [];
var allInputIds = [];
var idMap = {};
var dupes = [];

for (var i = 1; i <= 11; i++) {
    var f = path.join(dataDir, 'retake-practice-' + i + '.json');
    if (fs.existsSync(f)) {
        var rp = JSON.parse(fs.readFileSync(f, 'utf-8'));
        (rp.questions || []).forEach(function(q) {
            if (idMap[q.id]) {
                dupes.push(q.id + ' (in rp' + i + ' and ' + idMap[q.id] + ')');
            }
            idMap[q.id] = 'rp' + i;
            allQuestionIds.push(q.id);
            (q.inputs || []).forEach(function(inp) {
                allInputIds.push('rp' + i + ':' + inp.id);
            });
        });
    }
}

console.log('\u2500\u2500 Global ID uniqueness across 165 questions \u2500\u2500\n');

console.log('  Total questions: ' + allQuestionIds.length);
console.log('  Total inputs: ' + allInputIds.length);

test('All 165 questions loaded (11 exams x 15 questions)', allQuestionIds.length === 165);

if (dupes.length) dupes.slice(0,5).forEach(function(d) { console.log('  ! DUPE: ' + d); });
test('All question IDs are globally unique across all 11 exams', dupes.length === 0);

// Question IDs must include exam number to be unique (rp{N}-q{N} pattern)
var allRpFormatted = allQuestionIds.every(function(id) { return /^rp\d+-q\d+$/.test(id); });
test('All question IDs follow rp{N}-q{N} format (globally unique)', allRpFormatted);

console.log('\n' + '='.repeat(50));
console.log('rp-global-question-uniqueness: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
