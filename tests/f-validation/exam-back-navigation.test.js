// exam-back-navigation test
// exam.html must have a way to return to the dashboard (index.html)
// Kai must be able to exit an exam and get back to the home screen

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} exam-back-navigation.test.js\n');

var examSrc = fs.readFileSync(path.join(__dirname, '../../exam.html'), 'utf-8');

console.log('\u2500\u2500 Back navigation checks \u2500\u2500\n');

// Link back to index.html
var hasBackLink = examSrc.includes('index.html') || examSrc.includes('href="../"') ||
                  examSrc.includes('href="./"') || examSrc.includes("href='index.html'");
test('Link back to index.html present in exam.html', hasBackLink);

// Home/back button text or aria-label
var hasHomeLabel = examSrc.includes('Home') || examSrc.includes('home') || 
                   examSrc.includes('Dashboard') || examSrc.includes('Back') ||
                   examSrc.includes('Motor City');
test('Home/back navigation label present', hasHomeLabel);

console.log('\n' + '='.repeat(50));
console.log('exam-back-navigation: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
