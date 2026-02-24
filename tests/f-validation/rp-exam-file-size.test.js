// rp-exam-file-size test
// Each RP exam JSON file must be under 100KB
// Oversized files slow download and parsing, especially on mobile

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} rp-exam-file-size.test.js\n');

var dataDir = path.join(__dirname, '../../data');
var overLimit = [], MAX_BYTES = 100 * 1024; // 100KB

console.log('\u2500\u2500 Exam file size checks \u2500\u2500\n');

for (var i = 1; i <= 11; i++) {
    var f = path.join(dataDir, 'retake-practice-' + i + '.json');
    if (!fs.existsSync(f)) continue;
    var bytes = fs.statSync(f).size;
    var kb = (bytes / 1024).toFixed(1);
    console.log('  rp' + i + ': ' + kb + 'KB');
    if (bytes > MAX_BYTES) {
        overLimit.push('rp' + i + ': ' + kb + 'KB (limit 100KB)');
    }
}

if (overLimit.length) { console.log(''); overLimit.forEach(function(v) { console.log('  ! ' + v); }); }

test('All 11 RP exam files under 100KB', overLimit.length === 0);

console.log('\n' + '='.repeat(50));
console.log('rp-exam-file-size: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
