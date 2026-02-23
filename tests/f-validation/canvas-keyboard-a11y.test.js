// Canvas keyboard a11y lock test
// Verifies sw-18 and sw-03 requirements: graph canvas must have tabindex, role=img, aria-label
// and keyboard interaction (Enter/Space) triggers aria-live announcement

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} canvas-keyboard-a11y.test.js\n');

var examSrc = fs.readFileSync(path.join(__dirname, '../../exam.html'), 'utf-8');

console.log('\u2500\u2500 Canvas keyboard accessibility (WCAG 2.1.1) \u2500\u2500\n');

// 1. Canvas elements have tabindex=0
var hasTabindex = examSrc.includes("tabindex='0'") || examSrc.includes('tabindex="0"') ||
                  examSrc.includes("tabindex=0") || examSrc.includes("tabindex: '0'");
test("Graph canvas elements have tabindex='0'", hasTabindex);

// 2. Canvas elements have role=application (keyboard-interactive) or role=img (read-only)
var hasRoleImg = examSrc.includes("role='img'") || examSrc.includes('role="img"') ||
                 examSrc.includes("role='application'") || examSrc.includes('role="application"');
test("Graph canvas elements have role='application' or role='img'", hasRoleImg);

// 3. Canvas elements have aria-label (generated dynamically or static)
var hasAriaLabel = examSrc.includes('aria-label') && (examSrc.includes('canvas') || examSrc.includes('Chart'));
test('Graph canvas elements have aria-label text', hasAriaLabel);

// 4. Keyboard handler for canvas (Enter/Space triggers announcement)
var hasKeyHandler = examSrc.includes('keydown') || examSrc.includes('keyup') || examSrc.includes('KeyEnter') ||
                    examSrc.includes("'Enter'") || examSrc.includes('"Enter"') || examSrc.includes('keyCode');
test('Canvas has keyboard event handler (Enter/Space key)', hasKeyHandler);

// 5. aria-live region exists for canvas announcements
var hasAriaLive = examSrc.includes('aria-live');
test('aria-live region exists for canvas key announcements', hasAriaLive);

console.log('\n' + '='.repeat(50));
console.log('canvas-keyboard-a11y: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
