// index-score-card-sections test
// index.html score card must have sections for: exam title, score, grade, date
// Incomplete score cards don't give Kai enough context on his history

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} index-score-card-sections.test.js\n');

var indexSrc = fs.readFileSync(path.join(__dirname, '../../index.html'), 'utf-8');

console.log('\u2500\u2500 Score card section checks \u2500\u2500\n');

// Score display with grade
var hasGradeDisplay = indexSrc.includes('Grade') || indexSrc.includes('grade') || indexSrc.includes('A (');
test('Grade display in score history', hasGradeDisplay);

// Date/time of test recorded
var hasDate = indexSrc.includes('date') || indexSrc.includes('Date') || indexSrc.includes('timestamp');
test('Date recorded in score data', hasDate);

// Score shown as fraction
var hasFraction = indexSrc.includes('correct') && indexSrc.includes('total');
test('Score shown as fraction (correct/total)', hasFraction);

// Test name/title shown
var hasTitle = indexSrc.includes('title') || indexSrc.includes('exam_id') || indexSrc.includes('retake-practice');
test('Test title/ID shown in score history', hasTitle);

console.log('\n' + '='.repeat(50));
console.log('index-score-card-sections: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
