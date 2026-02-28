// rp-exam-id-no-spaces test
// exam_id fields must not contain spaces (used in URL params and filenames)
// Spaces in IDs would break the ?file= URL parameter routing

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} rp-exam-id-no-spaces.test.js\n');

var dataDir = path.join(__dirname, '../../data');
var bad = [], total = 0;

for (var i = 1; i <= 11; i++) {
    var f = path.join(dataDir, 'retake-practice-' + i + '.json');
    if (!fs.existsSync(f)) continue;
    total++;
    var rp = JSON.parse(fs.readFileSync(f, 'utf-8'));
    if (rp.exam_id && /\s/.test(rp.exam_id)) {
        bad.push('rp' + i + ': exam_id="' + rp.exam_id + '" contains spaces');
    }
}

console.log('\u2500\u2500 exam_id space checks \u2500\u2500\n');
if (bad.length) bad.forEach(function(v) { console.log('  ! ' + v); });

test('All ' + total + ' RP exam IDs are space-free', bad.length === 0);

console.log('\n' + '='.repeat(50));
console.log('rp-exam-id-no-spaces: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
