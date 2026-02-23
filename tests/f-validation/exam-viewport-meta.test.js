// Exam mobile-friendly viewport meta test
// MCM exams must have proper viewport meta tag for mobile
// Kai uses phone to study -- bad viewport breaks layout

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} exam-viewport-meta.test.js\n');

var HTML_FILES = [
    'exam.html',
    'index.html',
    'final_exam_251123.html',
    'final_exam_251123_mini.html'
];

var baseDir = path.join(__dirname, '../../');

console.log('\u2500\u2500 Viewport meta checks \u2500\u2500\n');

HTML_FILES.forEach(function(file) {
    var f = path.join(baseDir, file);
    if (!fs.existsSync(f)) {
        console.log('  SKIP: ' + file + ' not found');
        return;
    }
    var src = fs.readFileSync(f, 'utf-8');
    // Check viewport meta exists
    var hasViewport = src.includes('name="viewport"') || src.includes("name='viewport'");
    test(file + ': has <meta name="viewport">', hasViewport);
    if (hasViewport) {
        // Check width=device-width
        var hasDeviceWidth = src.includes('width=device-width');
        test(file + ': viewport includes width=device-width', hasDeviceWidth);
        // Check initial-scale=1
        var hasInitialScale = src.includes('initial-scale=1');
        test(file + ': viewport includes initial-scale=1', hasInitialScale);
    }
});

console.log('\n' + '='.repeat(50));
console.log('exam-viewport-meta: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
