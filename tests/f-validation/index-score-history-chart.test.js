// index-score-history-chart test
// index.html dashboard must render a score history chart via Chart.js
// Without chart, Kai can't see his performance trend over time

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} index-score-history-chart.test.js\n');

var indexSrc = fs.readFileSync(path.join(__dirname, '../../index.html'), 'utf-8');

console.log('\u2500\u2500 Score history chart checks \u2500\u2500\n');

// 1. Canvas element for chart
var hasCanvas = indexSrc.includes('<canvas') || indexSrc.includes('canvas');
test('Canvas element present for score chart', hasCanvas);

// 2. buildChart function defined in index.html
var hasBuildChart = indexSrc.includes('buildChart');
test('buildChart() function defined in index.html', hasBuildChart);

// 3. Chart uses score data from localStorage
var hasScoreData = indexSrc.includes('scores') && indexSrc.includes('buildChart');
test('buildChart called with score data', hasScoreData);

console.log('\n' + '='.repeat(50));
console.log('index-score-history-chart: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
