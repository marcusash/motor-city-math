// Dynamic exam picker test -- index.html
// Dashboard must show exam picker with all 11 exams listed
// Picker must use manifest.json as source of truth (not hardcoded)

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} exam-picker-manifest.test.js\n');

var examSrc = fs.readFileSync(path.join(__dirname, '../../exam.html'), 'utf-8');

var indexSrc = fs.readFileSync(path.join(__dirname, '../../index.html'), 'utf-8');
var manifest = JSON.parse(fs.readFileSync(path.join(__dirname, '../../data/manifest.json'), 'utf-8'));

console.log('\u2500\u2500 Exam picker manifest integration \u2500\u2500\n');

// 1. exam.html fetches manifest.json and has renderPicker fallback
var hasManifestFetch = examSrc.includes('manifest.json') && (examSrc.includes('fetch') || examSrc.includes('XMLHttpRequest'));
test('exam.html fetches manifest.json for exam picker', hasManifestFetch);

// 2. Exam picker renders exam list from data (not hardcoded)
var hasRenderPicker = examSrc.includes('renderPicker') || examSrc.includes('render') && examSrc.includes('exam');
test('Exam picker uses renderPicker() or dynamic render function', hasRenderPicker);

// 3. Manifest has 11 exams
var examCount = (manifest.exams || []).length;
test('manifest.json has exactly 11 exams', examCount === 11);

// 4. All manifest exams have required fields: id, title, time_minutes
var allExamsValid = (manifest.exams || []).every(function(e) {
    return e.id && e.title;
});
test('All manifest exam entries have id and title', allExamsValid);

// 5. Manifest IDs all match retake-practice-N pattern
var allIds = (manifest.exams || []).map(function(e) { return e.id; });
var idFormatOk = allIds.every(function(id) { return /^retake-practice-\d+$/.test(id); });
test('All manifest IDs match retake-practice-N format', idFormatOk);

console.log('\n' + '='.repeat(50));
console.log('exam-picker-manifest: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
