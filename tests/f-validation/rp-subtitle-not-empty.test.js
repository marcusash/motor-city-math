// rp-subtitle-not-empty test
// All RP exams must have a subtitle field (used in dashboard card)
// Empty subtitle shows a blank line on the exam picker card

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} rp-subtitle-not-empty.test.js\n');

var dataDir = path.join(__dirname, '../../data');

console.log('\u2500\u2500 Subtitle field checks \u2500\u2500\n');

var missing = [], total = 0;
for (var i = 1; i <= 11; i++) {
    var f = path.join(dataDir, 'retake-practice-' + i + '.json');
    if (!fs.existsSync(f)) continue;
    total++;
    var rp = JSON.parse(fs.readFileSync(f, 'utf-8'));
    if (!rp.subtitle || rp.subtitle.trim() === '') {
        missing.push('rp' + i + ': subtitle empty or missing');
    }
}
if (missing.length) missing.forEach(function(v) { console.log('  ! ' + v); });

test('All ' + total + ' RP exams have non-empty subtitle', missing.length === 0);

console.log('\n' + '='.repeat(50));
console.log('rp-subtitle-not-empty: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
