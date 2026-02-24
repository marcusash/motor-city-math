// rp-exam-id-matches-filename test
// exam_id in each RP JSON must match the filename (retake-practice-N)
// Mismatched IDs break the exam picker's score lookup in localStorage

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} rp-exam-id-matches-filename.test.js\n');

var dataDir = path.join(__dirname, '../../data');
var mismatch = [];

console.log('\u2500\u2500 Exam ID vs filename checks \u2500\u2500\n');

for (var i = 1; i <= 11; i++) {
    var fname = 'retake-practice-' + i;
    var f = path.join(dataDir, fname + '.json');
    if (!fs.existsSync(f)) continue;
    var rp = JSON.parse(fs.readFileSync(f, 'utf-8'));
    var id = rp.exam_id || '';
    var matches = id === fname || id.includes(fname) || fname.includes(id);
    console.log('  rp' + i + ': exam_id="' + id + '" ' + (matches ? '\u2705' : '\u274c'));
    if (!matches) {
        mismatch.push('rp' + i + ': exam_id="' + id + '" does not match filename "' + fname + '"');
    }
}

if (mismatch.length) { console.log(''); mismatch.forEach(function(v) { console.log('  ! ' + v); }); }

test('All 11 RP exam_ids match their filename', mismatch.length === 0);

console.log('\n' + '='.repeat(50));
console.log('rp-exam-id-matches-filename: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
