// index.html chart.js usage test
// Dashboard uses Chart.js for sparkline graphs
// Validates that Chart.js is loaded locally and canvas is used

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} dashboard-chartjs-usage.test.js\n');

var indexSrc = fs.readFileSync(path.join(__dirname, '../../index.html'), 'utf-8');

console.log('\u2500\u2500 Dashboard Chart.js checks \u2500\u2500\n');

// 1. Chart.js loaded from local shared/ (not CDN)
var hasLocalChartJs = indexSrc.includes('shared/chart.min.js') || indexSrc.includes('shared/Chart.js') ||
                      indexSrc.includes('shared/chartjs') || indexSrc.includes('../shared/chart');
var hasCdnChartJs = indexSrc.includes('cdn.jsdelivr.net/npm/chart') || indexSrc.includes('cdnjs.cloudflare.com/ajax/libs/Chart');
test('Chart.js loaded from local shared/ directory', hasLocalChartJs && !hasCdnChartJs);

// 2. canvas element used for charts
var hasCanvas = indexSrc.includes('<canvas') || indexSrc.includes("createElement('canvas')") ||
                indexSrc.includes('canvas') && indexSrc.includes('Chart');
test('Canvas element used for chart rendering', hasCanvas);

// 3. buildChart function or Chart.js initialization
var hasNewChart = indexSrc.includes('new Chart(') || indexSrc.includes('buildChart') ||
                  indexSrc.includes('MCMChart') || indexSrc.includes('Chart.create');
test('Chart.js initialized (new Chart or buildChart function)', hasNewChart);

// 4. Chart type is appropriate (line, bar, or doughnut for grade display)
// MCM may use buildChart() which defines type in chart-theme or dynamically
var hasChartType = indexSrc.includes("type: 'line'") || indexSrc.includes("type: 'bar'") ||
                   indexSrc.includes("type: 'doughnut'") || indexSrc.includes('type:"line"') ||
                   indexSrc.includes('type: "line"') || indexSrc.includes("'line'") ||
                   indexSrc.includes('buildChart'); // buildChart encapsulates type
test('Chart type defined (line/bar/doughnut) or buildChart() encapsulates type', hasChartType);

console.log('\n' + '='.repeat(50));
console.log('dashboard-chartjs-usage: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
