// rp-created-date-recent test
// All RP exams should have been created in 2025-2026 (MCM project timeline)
// Dates outside this range indicate placeholder or incorrect data

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} rp-created-date-recent.test.js\n');

var dataDir = path.join(__dirname, '../../data');
var badDates = [], examsChecked = 0;

for (var i = 1; i <= 11; i++) {
    var f = path.join(dataDir, 'retake-practice-' + i + '.json');
    if (!fs.existsSync(f)) continue;
    var rp = JSON.parse(fs.readFileSync(f, 'utf-8'));
    examsChecked++;
    var created = rp.created || '';
    if (created) {
        var year = parseInt(created.slice(0, 4), 10);
        if (year < 2025 || year > 2027) {
            badDates.push('rp' + i + ': created=' + created + ' (year ' + year + ' out of range)');
        } else {
            console.log('  rp' + i + ': ' + created);
        }
    } else {
        badDates.push('rp' + i + ': missing created date');
    }
}

console.log('\u2500\u2500 Created date checks \u2500\u2500\n');
if (badDates.length) badDates.forEach(function(v) { console.log('  ! ' + v); });

test('All 11 exams checked', examsChecked === 11);
test('All created dates in 2025-2027 range', badDates.length === 0);

console.log('\n' + '='.repeat(50));
console.log('rp-created-date-recent: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
