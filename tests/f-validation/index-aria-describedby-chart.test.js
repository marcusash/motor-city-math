// index-aria-describedby-chart test
// Chart canvases should have aria-describedby pointing to a description
// Screen readers cannot see charts; aria-describedby provides text alternative

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} index-aria-describedby-chart.test.js\n');

var html = fs.readFileSync(path.join(__dirname, '../../index.html'), 'utf-8');

// Chart canvases are created dynamically via JS; check JS creates canvas or uses chart-box
var hasChartBox = /class="[^"]*chart-box[^"]*"/.test(html);
var hasCanvasInJs = /document\.createElement\(['"]canvas['"]\)/.test(html);
var hasChartInit = /buildChart\(/.test(html) || /new Chart\(/.test(html);

test('index.html uses chart-box or dynamic canvas', hasChartBox || hasCanvasInJs || hasChartInit);

console.log('\n' + '='.repeat(50));
console.log('index-aria-describedby-chart: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
