// exam-canvas-aria-label test
// All canvas elements in exam.html must have aria-label
// Canvas is not accessible to screen readers without an accessible name

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} exam-canvas-aria-label.test.js\n');

var examSrc = fs.readFileSync(path.join(__dirname, '../../exam.html'), 'utf-8');

console.log('\u2500\u2500 Canvas aria-label checks \u2500\u2500\n');

// Count canvas elements
var canvasMatches = examSrc.match(/<canvas[^>]*>/g) || [];

// Check canvas elements have aria-label or aria-labelledby
var noAriaCanvas = canvasMatches.filter(function(c) {
    return !c.includes('aria-label') && !c.includes('aria-labelledby');
});

if (noAriaCanvas.length > 0) {
    noAriaCanvas.forEach(function(c) { console.log('  ! Missing aria: ' + c.substring(0,80)); });
}

test('Total canvas elements with accessible names: ' + (canvasMatches.length - noAriaCanvas.length) + '/' + canvasMatches.length,
    noAriaCanvas.length === 0);

console.log('\n' + '='.repeat(50));
console.log('exam-canvas-aria-label: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
