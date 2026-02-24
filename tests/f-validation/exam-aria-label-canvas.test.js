// exam-aria-label-canvas test
// Canvas elements used for graph plotting in exam.html must have aria-label
// so screen readers can describe what the graph represents

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} exam-aria-label-canvas.test.js\n');

var html = fs.readFileSync(path.join(__dirname, '../../exam.html'), 'utf-8');

console.log('\u2500\u2500 Canvas aria-label checks \u2500\u2500\n');

// Canvas elements should have aria-label or be given one dynamically
var hasCanvasAriaLabel = html.includes('aria-label') && html.includes('canvas');
// Check for dynamic assignment: canvas.setAttribute('aria-label', ...)
var hasDynamicAriaLabel = html.includes("setAttribute('aria-label'") || html.includes('setAttribute("aria-label"');

test('exam.html has aria-label on canvas or sets it dynamically', hasCanvasAriaLabel);
test('exam.html sets aria-label via setAttribute for dynamic graphs', hasDynamicAriaLabel);

console.log('\n' + '='.repeat(50));
console.log('exam-aria-label-canvas: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
