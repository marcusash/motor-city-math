// Manifest exam count test
// data/manifest.json must have exactly 11 exam entries (RP1-RP11)
// Manifest drives the exam picker in exam.html

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} manifest-exam-count.test.js\n');

var manifestPath = path.join(__dirname, '../../data/manifest.json');
var manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));

console.log('\u2500\u2500 Manifest exam count checks \u2500\u2500\n');

var exams = manifest.exams || manifest;
var examCount = Array.isArray(exams) ? exams.length : Object.keys(exams).length;
console.log('  Exams in manifest: ' + examCount);

test('manifest.json has exactly 11 exam entries', examCount === 11);

// Check each has required fields
var missingFields = [];
var requiredFields = ['id', 'title'];
(Array.isArray(exams) ? exams : Object.values(exams)).forEach(function(exam, idx) {
    requiredFields.forEach(function(field) {
        if (!exam[field]) {
            missingFields.push('exam[' + idx + '] missing field: ' + field);
        }
    });
});

if (missingFields.length) missingFields.slice(0,3).forEach(function(v) { console.log('  ! ' + v); });
test('All manifest exams have id and title fields', missingFields.length === 0);

// Check file references resolve (id maps to data/retake-practice-N.json)
var brokenRefs = [];
(Array.isArray(exams) ? exams : Object.values(exams)).forEach(function(exam) {
    if (!exam.id) return;
    var jsonFile = path.join(__dirname, '../../data/' + exam.id + '.json');
    if (!fs.existsSync(jsonFile)) {
        brokenRefs.push('manifest id "' + exam.id + '" -> data/' + exam.id + '.json not found');
    }
});

if (brokenRefs.length) brokenRefs.slice(0,3).forEach(function(v) { console.log('  ! ' + v); });
test('All manifest exam IDs resolve to existing data files', brokenRefs.length === 0);

console.log('\n' + '='.repeat(50));
console.log('manifest-exam-count: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
