// Manifest all files exist check
// Every entry in data/manifest.json must have a corresponding JSON file in data/

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} manifest-all-files-exist.test.js\n');

var dataDir = path.join(__dirname, '../../data');
var manifestPath = path.join(dataDir, 'manifest.json');
var manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));

console.log('\u2500\u2500 Manifest data file existence checks \u2500\u2500\n');

var exams = manifest.exams || manifest;
if (!Array.isArray(exams)) exams = Object.values(exams);

console.log('  Manifest entries: ' + exams.length);
test('Manifest has at least 1 entry', exams.length >= 1);

var missing = [];
exams.forEach(function(exam) {
    var id = typeof exam === 'string' ? exam : (exam.id || exam.file);
    if (!id) return;
    // Resolve filename (strip path prefix if any)
    var fname = id.replace('exam.html?file=', '').replace('.json', '') + '.json';
    var fpath = path.join(dataDir, fname);
    if (!fs.existsSync(fpath)) {
        missing.push(fname);
    }
});

test('All manifest-referenced JSON files exist in data/', missing.length === 0);
if (missing.length) missing.forEach(function(m) { console.log('  ! Missing: ' + m); });

// All 11 retake practice exams (rp1-rp11) are present as files
var rpMissing = [];
for (var i = 1; i <= 11; i++) {
    var rpFile = path.join(dataDir, 'retake-practice-' + i + '.json');
    if (!fs.existsSync(rpFile)) rpMissing.push('retake-practice-' + i + '.json');
}
test('All 11 retake-practice-{N}.json files exist in data/', rpMissing.length === 0);
if (rpMissing.length) rpMissing.forEach(function(m) { console.log('  ! Missing: ' + m); });

console.log('\n' + '='.repeat(50));
console.log('manifest-all-files-exist: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
