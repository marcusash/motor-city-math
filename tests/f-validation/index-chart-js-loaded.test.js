// index-chart-js-loaded test  
// index.html must load Chart.js for the score history charts
// Without Chart.js the dashboard shows broken canvas elements

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} index-chart-js-loaded.test.js\n');

var indexSrc = fs.readFileSync(path.join(__dirname, '../../index.html'), 'utf-8');

console.log('\u2500\u2500 Chart.js load checks \u2500\u2500\n');

// 1. Chart.js script tag
var hasChartJs = indexSrc.includes('chart.js') || indexSrc.includes('Chart.js') || indexSrc.includes('chart.min.js');
test('Chart.js included in index.html', hasChartJs);

// 2. chart-theme.js loaded (MCM chart defaults)
var hasChartTheme = indexSrc.includes('chart-theme.js') || indexSrc.includes('chart-theme');
test('chart-theme.js loaded (MCM defaults)', hasChartTheme);

// 3. buildChart function used in dashboard
var hasBuildChart = indexSrc.includes('buildChart');
test('buildChart() called in dashboard', hasBuildChart);

console.log('\n' + '='.repeat(50));
console.log('index-chart-js-loaded: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
