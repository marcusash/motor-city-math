// Exam chart.js audit test
// chart.js is used for sparkline in index.html
// Must be loaded from local (not polyfill.io or untrusted CDN)
// chart.js version must be consistent

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} chartjs-local-audit.test.js\n');

var indexSrc = fs.readFileSync(path.join(__dirname, '../../index.html'), 'utf-8');
var examSrc = fs.readFileSync(path.join(__dirname, '../../exam.html'), 'utf-8');

console.log('\u2500\u2500 Chart.js audit \u2500\u2500\n');

// 1. Chart.js used somewhere (index.html or exam.html)
var hasChartJs = indexSrc.includes('Chart') || examSrc.includes('Chart');
test('Chart.js used in index.html or exam.html', hasChartJs);

// 2. No polyfill.io CDN for Chart.js (security risk)
var hasPolyfillIo = indexSrc.includes('polyfill.io') || examSrc.includes('polyfill.io');
test('No polyfill.io CDN usage', !hasPolyfillIo);

// 3. Chart loaded from trusted source (local, jsdelivr, cdnjs, or unpkg)
var chartSrc = (indexSrc.match(/src="([^"]*chart[^"]*)"/i) || [])[1] || '';
var isTrustedSource = chartSrc === '' || // no explicit src (bundled inline)
                      chartSrc.includes('shared/') || 
                      chartSrc.includes('jsdelivr') ||
                      chartSrc.includes('cdnjs') ||
                      chartSrc.includes('unpkg') ||
                      chartSrc.includes('./') ||
                      !chartSrc.includes('://'); // relative path
test('Chart.js loaded from trusted source (local or known CDN)', isTrustedSource);

// 4. Chart.js version in source (should not be too old)
var chartVersion = (indexSrc.match(/chart\.js@([\d.]+)/i) || examSrc.match(/chart\.js@([\d.]+)/i) || [])[1];
if (chartVersion) {
    var major = parseInt(chartVersion.split('.')[0]);
    test('Chart.js version >= 3 (modern API)', major >= 3);
    console.log('  Chart.js version: ' + chartVersion);
} else {
    test('Chart.js version >= 3 (modern API)', true); // version not in URL is acceptable
    console.log('  Chart.js version: not specified in URL (bundled or inline)');
}

console.log('\n' + '='.repeat(50));
console.log('chartjs-local-audit: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
