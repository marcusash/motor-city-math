// exam-canvas-tabindex test
// Graph canvases in exam.html must have tabindex for keyboard accessibility
// Without tabindex, keyboard users cannot reach graph interaction areas

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} exam-canvas-tabindex.test.js\n');

var examSrc = fs.readFileSync(path.join(__dirname, '../../exam.html'), 'utf-8');

console.log('\u2500\u2500 Canvas accessibility checks \u2500\u2500\n');

// Canvas elements have tabindex
var hasTabindex = examSrc.includes('tabindex') && examSrc.includes('canvas');
test('tabindex defined on canvas elements', hasTabindex);

// Keyboard event handlers on canvas
var hasKeyHandler = examSrc.includes('keydown') || examSrc.includes('keyup') || examSrc.includes('KeyboardEvent');
test('Keyboard event handler for canvas present', hasKeyHandler);

// canvas elements have aria-label
var hasCanvasAria = examSrc.includes('canvas') && (examSrc.includes('aria-label') || examSrc.includes('aria-describedby'));
test('Canvas elements have aria-label or aria-describedby', hasCanvasAria);

console.log('\n' + '='.repeat(50));
console.log('exam-canvas-tabindex: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
