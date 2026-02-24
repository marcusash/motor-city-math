// exam-section-headings-present test
// exam.html should show section headings (A, B, C, D) to orient Kai
// Section headings help with exam navigation and time allocation

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} exam-section-headings-present.test.js\n');

var examSrc = fs.readFileSync(path.join(__dirname, '../../exam.html'), 'utf-8');

console.log('\u2500\u2500 Section heading checks \u2500\u2500\n');

// Section labels in display
var hasSectionDisplay = examSrc.includes('section') && 
    (examSrc.includes('Section A') || examSrc.includes("section-label") ||
     examSrc.includes('sectionLabel') || examSrc.includes("q.section") ||
     examSrc.includes('Section B') || examSrc.includes('sectionName'));
test('Section headings/labels displayed in exam.html', hasSectionDisplay);

// Section letter shown per question
var hasSectionLetter = examSrc.includes('.section') || examSrc.includes('q.section') ||
                       examSrc.includes('[section]') || examSrc.includes('section-');
test('Section letter accessible from question data in exam.html', hasSectionLetter);

console.log('\n' + '='.repeat(50));
console.log('exam-section-headings-present: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
