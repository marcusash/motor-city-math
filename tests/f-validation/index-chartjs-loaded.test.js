// index-chartjs-loaded test
// index.html (the dashboard) must load Chart.js for the SAAS grade chart
// The dashboard uses Chart.js for score visualization

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} index-chartjs-loaded.test.js\n');

var html = fs.readFileSync(path.join(__dirname, '../../index.html'), 'utf-8');

// Chart.js must be present in the dashboard
var hasChartJS = /chart\.js|chart\.min\.js|new\s+Chart\s*\(/i.test(html);
var hasChartInstantiation = /new\s+Chart\s*\(/i.test(html) || /buildChart\s*\(/i.test(html);

test('index.html loads Chart.js', hasChartJS);
test('index.html instantiates a Chart', hasChartInstantiation);
if (!hasChartJS) console.log('    ! Chart.js not found in index.html (needed for SAAS grade chart)');

console.log('\n' + '='.repeat(50));
console.log('index-chartjs-loaded: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
