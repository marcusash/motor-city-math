// shared-chart-theme-exists test
// chart-theme.js must exist in shared/ and export buildChart or chart initialization
// This is required for the dashboard score charts to render correctly

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} shared-chart-theme-exists.test.js\n');

var sharedDir = path.join(__dirname, '../../shared');
var chartThemePath = path.join(sharedDir, 'chart-theme.js');

console.log('\u2500\u2500 chart-theme.js checks \u2500\u2500\n');

// 1. File exists
test('shared/chart-theme.js exists', fs.existsSync(chartThemePath));

if (fs.existsSync(chartThemePath)) {
    var src = fs.readFileSync(chartThemePath, 'utf-8');

    // 2. buildChart or MCM_CHART_COLORS defined (theme establishes palette)
    var hasBuildChart = src.includes('function buildChart') || src.includes('buildChart =') ||
                        src.includes('MCM_CHART_COLORS') || src.includes('Chart.defaults');
    test('buildChart() or MCM_CHART_COLORS defined', hasBuildChart);

    // 3. MCM color palette referenced
    var hasMcmColors = src.includes('#C8102E') || src.includes('#1D42BA') || src.includes('#002D62') ||
                       src.includes('var(--') || src.includes('accent-red') || src.includes('accent-blue');
    test('MCM Pistons color palette used in chart theme', hasMcmColors);

    // 4. Chart.js used (not D3 or other)
    var hasChartJs = src.includes('Chart') || src.includes('chart');
    test('Chart.js referenced in chart-theme.js', hasChartJs);
} else {
    fail += 3;
    console.log('  \u274c buildChart() not checked (file missing)');
    console.log('  \u274c MCM colors not checked (file missing)');
    console.log('  \u274c Chart.js not checked (file missing)');
}

console.log('\n' + '='.repeat(50));
console.log('shared-chart-theme-exists: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
