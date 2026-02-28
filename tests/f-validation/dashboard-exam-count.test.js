// index.html exam count display test
// Dashboard must reference all 11 RP exams in its exam list
// If Kai opens dashboard, all exams should be discoverable

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} dashboard-exam-count.test.js\n');

var indexSrc = fs.readFileSync(path.join(__dirname, '../../index.html'), 'utf-8');

console.log('\u2500\u2500 Dashboard exam count checks \u2500\u2500\n');

// Count references to retake-practice exams in index.html
var rpRefs = [];
for (var i = 1; i <= 11; i++) {
    var pattern = 'retake-practice-' + i;
    if (indexSrc.includes(pattern)) rpRefs.push(i);
}

console.log('  Retake practice exams found in index.html: ' + rpRefs.join(', '));
test('All 11 retake practice exams referenced in index.html', rpRefs.length === 11);

// Check that tests array or exam list is defined
var hasTestsArray = indexSrc.includes("tests =") || indexSrc.includes("tests=[") ||
                    indexSrc.includes("const tests") || indexSrc.includes("var tests") ||
                    indexSrc.includes("exams =") || indexSrc.includes("exams=[");
test('Dashboard defines exam/tests array in index.html', hasTestsArray);

// Check for exam card / exam item render
var hasExamCard = indexSrc.includes('exam-card') || indexSrc.includes('test-card') ||
                  indexSrc.includes('exam-item') || indexSrc.includes('testCard') ||
                  indexSrc.includes('.exam') || indexSrc.includes('#exam');
test('Dashboard renders exam cards or items', hasExamCard);

console.log('\n' + '='.repeat(50));
console.log('dashboard-exam-count: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
