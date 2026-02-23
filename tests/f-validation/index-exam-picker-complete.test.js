// index-exam-picker-complete test
// index.html exam picker should list all 11 RP exams
// Missing exams mean Kai can't select them from the dashboard

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} index-exam-picker-complete.test.js\n');

var indexSrc = fs.readFileSync(path.join(__dirname, '../../index.html'), 'utf-8');
var manifestSrc = fs.readFileSync(path.join(__dirname, '../../data/manifest.json'), 'utf-8');
var manifest = JSON.parse(manifestSrc);

console.log('\u2500\u2500 Exam picker completeness checks \u2500\u2500\n');

// 1. All manifest exams referenced in index.html
var missing = [];
manifest.exams.forEach(function(exam) {
    var id = exam.id;
    if (!indexSrc.includes(id)) {
        missing.push(id + ' not referenced in index.html');
    }
});

if (missing.length) missing.forEach(function(v) { console.log('  ! ' + v); });

test('All manifest exams referenced in index.html (' + manifest.exams.length + ' exams)', missing.length === 0);

// 2. index.html has exam picker or tests array
var hasPicker = indexSrc.includes('retake-practice') || indexSrc.includes('exam-picker') ||
                indexSrc.includes('tests =') || indexSrc.includes('tests=');
test('index.html has exam picker / tests array', hasPicker);

// 3. Manifest has 11 exams
test('Manifest has 11 exams', manifest.exams.length === 11);

// 4. index.html links to exam.html for navigation
var hasExamLink = indexSrc.includes('exam.html');
test('index.html links to exam.html', hasExamLink);

console.log('\n' + '='.repeat(50));
console.log('index-exam-picker-complete: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
