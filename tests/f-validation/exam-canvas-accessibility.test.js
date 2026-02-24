// exam-canvas-accessibility test
// exam.html must provide keyboard access to canvas drawing (not mouse-only)
// Canvas elements need keyboard event handlers for WCAG 2.1.1

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} exam-canvas-accessibility.test.js\n');

var html = fs.readFileSync(path.join(__dirname, '../../exam.html'), 'utf-8');

// Canvas with tabindex makes it keyboard focusable
var hasCanvasTabindex = /tabindex/.test(html);
// Keyboard events for drawing
var hasKeyboardDrawing = /keydown|ArrowUp|ArrowDown|ArrowLeft|ArrowRight|Enter.*canvas|canvas.*Enter/i.test(html);

test('Canvas elements are keyboard accessible (tabindex present)', hasCanvasTabindex);
test('exam.html has keyboard event handling for canvas', hasKeyboardDrawing);

console.log('\n' + '='.repeat(50));
console.log('exam-canvas-accessibility: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
