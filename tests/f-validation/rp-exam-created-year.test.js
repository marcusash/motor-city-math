// rp-exam-created-year test
// All RP exam JSON files must have a created date in 2026
// 2025 or missing dates indicate stale/template exams that weren't properly dated

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} rp-exam-created-year.test.js\n');

var dataDir = path.join(__dirname, '../../data');
var wrong = [], found = [];

for (var i = 1; i <= 11; i++) {
    var f = path.join(dataDir, 'retake-practice-' + i + '.json');
    if (!fs.existsSync(f)) continue;
    var rp = JSON.parse(fs.readFileSync(f, 'utf-8'));
    var created = rp.created || rp.created_at || '';
    found.push('rp' + i + ': ' + (created || 'MISSING'));
    if (!created || !created.startsWith('2026')) {
        wrong.push('rp' + i + ': created="' + created + '" (expected 2026-xx-xx)');
    }
}

console.log('\u2500\u2500 Created year checks \u2500\u2500\n');
found.forEach(function(v) { console.log('  ' + v); });
if (wrong.length) { console.log(''); wrong.forEach(function(v) { console.log('  ! ' + v); }); }

test('All 11 RP exams have 2026 created date', wrong.length === 0);

console.log('\n' + '='.repeat(50));
console.log('rp-exam-created-year: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
