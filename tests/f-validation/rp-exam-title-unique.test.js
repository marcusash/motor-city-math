// rp-exam-title-unique test
// Each exam must have a unique title (no two exams with identical titles)
// Identical titles confuse Kai when picking which exam to take

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} rp-exam-title-unique.test.js\n');

var dataDir = path.join(__dirname, '../../data');
var titles = {};
var duplicates = [];

for (var i = 1; i <= 11; i++) {
    var f = path.join(dataDir, 'retake-practice-' + i + '.json');
    if (!fs.existsSync(f)) continue;
    var rp = JSON.parse(fs.readFileSync(f, 'utf-8'));
    var t = (rp.title || '').trim();
    if (titles[t]) {
        duplicates.push('rp' + i + ' and rp' + titles[t] + ': duplicate title "' + t + '"');
    } else {
        titles[t] = i;
    }
}

console.log('\u2500\u2500 Exam title uniqueness checks \u2500\u2500\n');
if (duplicates.length) duplicates.forEach(function(v) { console.log('  ! ' + v); });

test('All exam titles are unique (' + duplicates.length + ' duplicates)', duplicates.length === 0);

console.log('\n' + '='.repeat(50));
console.log('rp-exam-title-unique: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
