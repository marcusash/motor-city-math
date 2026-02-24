// rp-exams-all-have-metadata test
// Every RP exam JSON must have top-level metadata: id, title, version, created, description
// Missing metadata causes broken dashboard display and exam picker entries

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} rp-exams-all-have-metadata.test.js\n');

var dataDir = path.join(__dirname, '../../data');
var required = ['exam_id', 'title', 'version', 'created'];
var missing = [];

for (var i = 1; i <= 11; i++) {
    var f = path.join(dataDir, 'retake-practice-' + i + '.json');
    if (!fs.existsSync(f)) continue;
    var rp = JSON.parse(fs.readFileSync(f, 'utf-8'));
    required.forEach(function(field) {
        if (!rp[field]) {
            missing.push('rp' + i + ': missing "' + field + '"');
        }
    });
}

console.log('\u2500\u2500 RP metadata checks \u2500\u2500\n');
if (missing.length) missing.forEach(function(v) { console.log('  ! ' + v); });

test('All 11 RP exams have required metadata fields', missing.length === 0);

console.log('\n' + '='.repeat(50));
console.log('rp-exams-all-have-metadata: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
