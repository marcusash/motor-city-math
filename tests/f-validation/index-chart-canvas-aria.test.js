// index-chart-canvas-aria test
// index.html chart/SVG must have proper aria-label for screen readers
// Without aria, the score chart is invisible to screen reader users

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} index-chart-canvas-aria.test.js\n');

var indexSrc = fs.readFileSync(path.join(__dirname, '../../index.html'), 'utf-8');

console.log('\u2500\u2500 Chart/SVG accessibility checks \u2500\u2500\n');

// buildChart function present
var hasBuildChart = indexSrc.includes('buildChart');
test('buildChart function defined in index.html', hasBuildChart);

// aria-label on SVG chart (set dynamically)
var hasAriaLabel = indexSrc.includes('aria-label') && 
                   (indexSrc.includes('Score progress') || indexSrc.includes('aria-label='));
test('aria-label set on score chart SVG', hasAriaLabel);

// role="img" on SVG
var hasRoleImg = indexSrc.includes('role="img"') || indexSrc.includes("role='img'");
test('role="img" set on chart SVG element', hasRoleImg);

console.log('\n' + '='.repeat(50));
console.log('index-chart-canvas-aria: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
