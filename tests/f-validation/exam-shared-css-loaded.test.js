// exam-shared-css-loaded test
// exam.html must load shared/styles.css (same as index.html)
// Without it, exam renders unstyled -- Kai can't take the test

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} exam-shared-css-loaded.test.js\n');

var examSrc = fs.readFileSync(path.join(__dirname, '../../exam.html'), 'utf-8');

console.log('\u2500\u2500 Shared asset loading checks \u2500\u2500\n');

// Shared stylesheet linked
var hasCss = examSrc.includes('shared/styles.css');
test('shared/styles.css linked in exam.html', hasCss);

// Shared scripts loaded
var hasJs = examSrc.includes('shared/scripts.js');
test('shared/scripts.js loaded in exam.html', hasJs);

// exam.html uses custom canvas-based graph rendering, not a chart library
var hasChartTheme = examSrc.includes('canvas') && examSrc.includes('graph');
test('Canvas graph support present in exam.html', hasChartTheme);

console.log('\n' + '='.repeat(50));
console.log('exam-shared-css-loaded: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
