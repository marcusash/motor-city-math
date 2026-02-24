// index-chartjs-version test
// index.html must load Chart.js for score history visualization
// Check that Chart.js is loaded (not an older broken version reference)

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} index-chartjs-version.test.js\n');

var indexSrc = fs.readFileSync(path.join(__dirname, '../../index.html'), 'utf-8');

console.log('\u2500\u2500 Chart.js version checks \u2500\u2500\n');

// 1. Chart.js script loaded
var hasChartJs = indexSrc.includes('Chart.js') || indexSrc.includes('chart.js') || 
                 indexSrc.includes('chart.min.js') || indexSrc.includes('Chart.min.js');
test('Chart.js script loaded in index.html', hasChartJs);

// 2. Chart constructor or SVG chart implementation used
var hasNewChart = indexSrc.includes('new Chart(') || indexSrc.includes('Chart.register') ||
                  (indexSrc.includes('buildChart') && (indexSrc.includes('<svg') || indexSrc.includes('viewBox')));
test('Chart or SVG score visualization used in index.html', hasNewChart);

// 3. Not loading both Chart.js 2.x and 3.x (version conflict)
var chartRefs = (indexSrc.match(/chart.*\.min\.js/gi) || []).length;
test('Single Chart.js reference (no version conflict): ' + chartRefs, chartRefs <= 1);

console.log('\n' + '='.repeat(50));
console.log('index-chartjs-version: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
