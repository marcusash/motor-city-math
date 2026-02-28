// rp-title-field-not-too-long test
// Exam title should be brief (<=80 chars) to fit in dashboard card header
// Long titles overflow or get truncated in unexpected ways

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} rp-title-field-not-too-long.test.js\n');

var dataDir = path.join(__dirname, '../../data');
var violations = [];
var MAX_LEN = 80;

for (var i = 1; i <= 11; i++) {
    var f = path.join(dataDir, 'retake-practice-' + i + '.json');
    if (!fs.existsSync(f)) continue;
    var rp = JSON.parse(fs.readFileSync(f, 'utf-8'));
    if (rp.title && rp.title.length > MAX_LEN) {
        violations.push('retake-practice-' + i + ': title is ' + rp.title.length + ' chars (max ' + MAX_LEN + '): "' + rp.title.slice(0, 40) + '..."');
    }
}

test('All exam titles are <= ' + MAX_LEN + ' chars (' + violations.length + ' violations)', violations.length === 0);
if (violations.length) violations.forEach(function(v) { console.log('    ! ' + v); });

console.log('\n' + '='.repeat(50));
console.log('rp-title-field-not-too-long: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
