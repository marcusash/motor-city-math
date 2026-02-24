// rp-id-matches-filename test
// exam_id in each RP JSON must match the filename (retake-practice-N)
// Mismatched IDs cause saveResults to store data under wrong key

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} rp-id-matches-filename.test.js\n');

var dataDir = path.join(__dirname, '../../data');
var violations = [];

for (var i = 1; i <= 11; i++) {
    var filename = 'retake-practice-' + i;
    var f = path.join(dataDir, filename + '.json');
    if (!fs.existsSync(f)) continue;
    var rp = JSON.parse(fs.readFileSync(f, 'utf-8'));
    if (rp.exam_id && rp.exam_id !== filename) {
        violations.push(filename + ': exam_id="' + rp.exam_id + '" does not match filename');
    }
}

test('All exam_id fields match their filename (' + violations.length + ' violations)', violations.length === 0);
if (violations.length) violations.forEach(function(v) { console.log('    ! ' + v); });

console.log('\n' + '='.repeat(50));
console.log('rp-id-matches-filename: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
