// manifest exam ID format validation test
// All manifest.json exam IDs must match /^retake-practice-\d+$/ convention

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} manifest-exam-id-format.test.js\n');

const manifest = JSON.parse(fs.readFileSync(path.join(__dirname, '../../data/manifest.json'), 'utf-8'));
const exams = manifest.exams || [];

console.log('\u2500\u2500 Manifest exam IDs (' + exams.length + ' exams) \u2500\u2500\n');

var badIds = [];
var seenIds = {};
var dupIds = [];

exams.forEach(function(exam) {
    var id = exam.id;
    var isValid = id && id.match(/^retake-practice-\d+$/);
    if (!isValid) {
        console.log('  \u274c Bad ID: "' + id + '"');
        badIds.push(id);
    } else {
        console.log('  \u2705 ' + id);
    }

    if (seenIds[id]) {
        dupIds.push(id);
    }
    seenIds[id] = true;
});

console.log('');
test('All exam IDs present (no null/undefined)', exams.every(function(e) { return e.id; }));
test('All exam IDs match retake-practice-{N} format', badIds.length === 0);
test('No duplicate exam IDs in manifest', dupIds.length === 0);

// Numeric sequence: should be 1..N with no gaps
var nums = exams.map(function(e) {
    var m = (e.id || '').match(/\d+$/);
    return m ? parseInt(m[0]) : null;
}).filter(function(n) { return n !== null; }).sort(function(a,b) { return a-b; });

var hasGap = false;
for (var i = 0; i < nums.length; i++) {
    if (nums[i] !== i + 1) { hasGap = true; break; }
}
test('Exam IDs form contiguous sequence 1..' + nums.length, !hasGap);
if (!hasGap) console.log('  Sequence: 1..' + nums[nums.length - 1] + ' (no gaps)');

// File references exist on disk
var dataDir = path.join(__dirname, '../../data');
var missingFiles = exams.filter(function(exam) {
    return !fs.existsSync(path.join(dataDir, exam.id + '.json'));
});
test('All manifest exam JSON files exist on disk', missingFiles.length === 0);
if (missingFiles.length > 0) {
    console.log('  Missing: ' + missingFiles.map(function(e) { return e.id + '.json'; }).join(', '));
}

console.log('\n' + '='.repeat(50));
console.log('manifest-exam-id-format: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
