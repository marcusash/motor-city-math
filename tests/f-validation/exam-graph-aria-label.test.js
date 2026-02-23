// Canvas aria-label test
// WCAG 1.1.1: canvas elements need descriptive aria-label for screen readers

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} exam-graph-aria-label.test.js\n');

const examSrc = fs.readFileSync(path.join(__dirname, '../../exam.html'), 'utf-8');

// Find canvas template in exam.html (dynamically rendered via JS)
var canvasTemplate = examSrc.match(/<canvas[^>]*aria-label[^>]*>/g) || [];
var canvasNoAriaLabel = examSrc.match(/<canvas(?![^>]*aria-label)[^>]*>/g) || [];

console.log('\u2500\u2500 Canvas elements \u2500\u2500');
canvasTemplate.forEach(function(c) { console.log('  WITH: ' + c.substring(0, 100)); });
canvasNoAriaLabel.forEach(function(c) { console.log('  SANS: ' + c.substring(0, 100)); });

// 1. At least one canvas element exists in exam.html
test('Canvas element found in exam.html', canvasTemplate.length > 0 || canvasNoAriaLabel.length > 0);

// 2. All canvas elements have aria-label
test('All canvas elements have aria-label attribute', canvasNoAriaLabel.length === 0);

// 3. Canvas aria-label contains "graph" or "Graph" (descriptive)
var hasDescriptiveLabel = canvasTemplate.some(function(c) {
    return c.toLowerCase().includes('graph') || c.toLowerCase().includes('chart') || c.toLowerCase().includes('plot');
});
test('Canvas aria-label includes "graph", "chart", or "plot" (descriptive)', hasDescriptiveLabel);

// 4. Canvas has role="application" or role="img" (not just generic)
var hasRole = canvasTemplate.some(function(c) {
    return c.includes('role="application"') || c.includes('role="img"');
});
test('Canvas has semantic role (application or img)', hasRole);

// 5. Canvas has tabindex for keyboard access (WCAG 2.1.1)
var hasTabindex = canvasTemplate.some(function(c) {
    return c.includes('tabindex=');
});
test('Canvas has tabindex (keyboard accessible)', hasTabindex);

// 6. exam.html has canvas keyboard event handler (Arrow key logic)
var keyHandlerSrc = examSrc.substring(examSrc.indexOf('canvas'), examSrc.indexOf('canvas') + 30000);
var hasKeyHandler = keyHandlerSrc.includes('keydown') || keyHandlerSrc.includes('ArrowLeft') ||
                    keyHandlerSrc.includes('addEventListener');
test('Canvas has keyboard event handler (keydown/Arrow keys)', hasKeyHandler);

// 7. Canvas has aria-live region for keyboard feedback
var hasAriaLive = examSrc.includes('aria-live') && (examSrc.includes('graph') || examSrc.includes('canvas'));
test('Canvas interaction feedback uses aria-live region', hasAriaLive);

console.log('\n' + '='.repeat(50));
console.log('exam-graph-aria-label: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
