// RP question ID uniqueness across all exams test
// Each question ID must be unique across ALL 11 exams
// Duplicate IDs would break localStorage key tracking

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} rp-question-id-global-unique.test.js\n');

var dataDir = path.join(__dirname, '../../data');
var seenIds = {};
var duplicates = [];
var totalChecked = 0;

for (var i = 1; i <= 11; i++) {
    var f = path.join(dataDir, 'retake-practice-' + i + '.json');
    if (!fs.existsSync(f)) continue;
    var rp = JSON.parse(fs.readFileSync(f, 'utf-8'));
    (rp.questions || []).forEach(function(q) {
        totalChecked++;
        if (seenIds[q.id]) {
            duplicates.push('rp' + i + ' ' + q.id + ' (also in rp' + seenIds[q.id] + ')');
        } else {
            seenIds[q.id] = i;
        }
    });
}

console.log('\u2500\u2500 Global question ID uniqueness checks \u2500\u2500\n');
console.log('  Total questions: ' + totalChecked + ', Unique IDs: ' + Object.keys(seenIds).length);

if (duplicates.length) duplicates.slice(0,5).forEach(function(v) { console.log('  ! Duplicate: ' + v); });
test('All question IDs are globally unique across all 11 exams', duplicates.length === 0);
test('At least 165 questions found', totalChecked >= 165);

console.log('\n' + '='.repeat(50));
console.log('rp-question-id-global-unique: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
