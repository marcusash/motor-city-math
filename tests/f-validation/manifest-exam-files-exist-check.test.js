// manifest-exam-files-exist test
// All files referenced in data/manifest.json must exist in data/ directory

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} manifest-exam-files-exist-check.test.js\n');

var dataDir = path.join(__dirname, '../../data');
var manifest = JSON.parse(fs.readFileSync(path.join(dataDir, 'manifest.json'), 'utf-8'));
var violations = [];

(manifest.exams || []).forEach(function(exam) {
    var fname = (exam.file || exam.id || exam.exam_id || '') + '.json';
    if (!fname || fname === '.json') {
        violations.push('Exam entry has no file/id field: ' + JSON.stringify(exam).substring(0,60));
        return;
    }
    if (!fs.existsSync(path.join(dataDir, fname))) {
        violations.push(fname + ': referenced in manifest but not found in data/');
    }
});

test('All manifest exam files exist in data/ (' + violations.length + ' violations)', violations.length === 0);
if (violations.length) violations.forEach(function(v) { console.log('    ! ' + v); });
console.log('  Manifest exams: ' + (manifest.exams || []).length);

console.log('\n' + '='.repeat(50));
console.log('manifest-exam-files-exist-check: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
