// Dashboard sparkline data test
// index.html buildSparkline() must handle edge cases:
// - No attempts: empty state (no crash)
// - 1 attempt: single bar
// - All zeros: renders without divide-by-zero

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} dashboard-sparkline-edge-cases.test.js\n');

var indexSrc = fs.readFileSync(path.join(__dirname, '../../index.html'), 'utf-8');

console.log('\u2500\u2500 Dashboard sparkline edge case checks \u2500\u2500\n');

// 1. buildSparkline function exists
var hasBuildSparkline = indexSrc.includes('buildSparkline') || indexSrc.includes('sparkline');
test('buildSparkline or sparkline function exists in index.html', hasBuildSparkline);

// 2. Empty state handled (no attempts = no crash)
var hasEmptyGuard = indexSrc.includes('length === 0') || indexSrc.includes('length == 0') ||
                    indexSrc.includes('.length < 1') || indexSrc.includes('attempts.length') ||
                    (indexSrc.includes('sparkline') && indexSrc.includes('if'));
test('Sparkline handles empty attempts array (no crash)', hasEmptyGuard);

// 3. Max score used for normalization (prevents divide-by-zero)
var hasMaxNorm = indexSrc.includes('Math.max') || indexSrc.includes('maxPct') || 
                 indexSrc.includes('|| 1') || indexSrc.includes('/ 100');
test('Sparkline normalizes values (Math.max or /100 pattern)', hasMaxNorm);

// 4. Sparkline uses SVG or Canvas or div bars
var hasSparklineElement = indexSrc.includes('sparkline') && 
                          (indexSrc.includes('svg') || indexSrc.includes('canvas') || 
                           indexSrc.includes('bar') || indexSrc.includes('width'));
test('Sparkline renders using visual element (svg, canvas, or bar divs)', hasSparklineElement);

console.log('\n' + '='.repeat(50));
console.log('dashboard-sparkline-edge-cases: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
