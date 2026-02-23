// RP question type distribution test
// Each RP exam should have at least 2 different question types
// Mono-type exams are boring and don't cover all skill modes

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} rp-type-distribution.test.js\n');

var dataDir = path.join(__dirname, '../../data');
var rpFiles = [];
for (var i = 1; i <= 11; i++) {
    var f = path.join(dataDir, 'retake-practice-' + i + '.json');
    if (fs.existsSync(f)) rpFiles.push({ n: i, data: JSON.parse(fs.readFileSync(f, 'utf-8')) });
}

console.log('\u2500\u2500 Question type diversity across 11 exams \u2500\u2500\n');

test('All 11 RP files loaded', rpFiles.length === 11);

// Each exam should have at least 2 different question types
var monoTypeExams = [];
rpFiles.forEach(function(rp) {
    var types = {};
    (rp.data.questions || []).forEach(function(q) {
        types[q.type || 'unknown'] = true;
    });
    var typeCount = Object.keys(types).length;
    if (typeCount < 2) {
        monoTypeExams.push('RP' + rp.n + ': only ' + typeCount + ' type(s): ' + Object.keys(types).join(', '));
    }
});

if (monoTypeExams.length) monoTypeExams.forEach(function(e) { console.log('  ! ' + e); });
test('All exams have at least 2 different question types', monoTypeExams.length === 0);

// Known types should all appear somewhere across all 11 exams
var allTypes = {};
rpFiles.forEach(function(rp) {
    (rp.data.questions || []).forEach(function(q) { if (q.type) allTypes[q.type] = true; });
});
var typeList = Object.keys(allTypes);
console.log('  Known types: ' + typeList.join(', '));
test('At least 2 question types exist across all exams', typeList.length >= 2);

console.log('\n' + '='.repeat(50));
console.log('rp-type-distribution: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
