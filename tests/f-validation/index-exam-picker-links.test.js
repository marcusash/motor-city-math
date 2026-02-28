// index-exam-picker-links test
// index.html exam picker must have links to all 11 retake practice exams
// Missing links mean Kai can't navigate to newer exams from the dashboard

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} index-exam-picker-links.test.js\n');

var indexSrc = fs.readFileSync(path.join(__dirname, '../../index.html'), 'utf-8');

console.log('\u2500\u2500 Exam picker link checks \u2500\u2500\n');

// All 11 retake practice exams referenced
for (var i = 1; i <= 11; i++) {
    var ref = 'retake-practice-' + i;
    var found = indexSrc.includes(ref);
    if (!found) console.log('  ! Missing reference to: ' + ref);
    test('index.html references ' + ref, found);
}

console.log('\n' + '='.repeat(50));
console.log('index-exam-picker-links: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
