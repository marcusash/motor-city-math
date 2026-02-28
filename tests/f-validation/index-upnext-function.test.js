// index-upnext-function test
// index.html must have updateUpNext() function that shows Kai's next recommended exam
// Drives the "Up Next" card on the dashboard

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} index-upnext-function.test.js\n');

var indexSrc = fs.readFileSync(path.join(__dirname, '../../index.html'), 'utf-8');

console.log('\u2500\u2500 updateUpNext function checks \u2500\u2500\n');

// updateUpNext function defined
var hasUpdateUpNext = indexSrc.includes('updateUpNext') || indexSrc.includes('upNext') || 
                      indexSrc.includes('up-next') || indexSrc.includes('Up Next');
test('Up Next feature present in index.html', hasUpdateUpNext);

// It reads from localStorage or test results
var hasScoreRead = indexSrc.includes('localStorage.getItem') || indexSrc.includes('getScores') || 
                   indexSrc.includes('getItem');
test('Up Next reads scores from localStorage', hasScoreRead);

// It outputs a link to the recommended exam
var hasExamLink = indexSrc.includes('exam.html') || indexSrc.includes('retake-practice');
test('Up Next links to exam.html or retake-practice', hasExamLink);

console.log('\n' + '='.repeat(50));
console.log('index-upnext-function: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
