// exam-chartjs-not-loaded test
// exam.html (the test renderer) should NOT load Chart.js
// Chart.js is only needed on index.html (dashboard). exam.html uses Canvas for graphing.

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} exam-chartjs-not-loaded.test.js\n');

var html = fs.readFileSync(path.join(__dirname, '../../exam.html'), 'utf-8');

// Chart.js is for dashboard charts -- should not be in exam renderer
var hasChartJS = /chart\.js|chart\.min\.js|cdn\.jsdelivr\.net\/npm\/chart/i.test(html);

test('exam.html does not load Chart.js (not needed in exam renderer)', !hasChartJS);
if (hasChartJS) console.log('    ! Chart.js found in exam.html (should only be in index.html)');

console.log('\n' + '='.repeat(50));
console.log('exam-chartjs-not-loaded: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
