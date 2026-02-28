// css-modal-overlay test
// shared/styles.css must define overlay/modal styles for hint panels
// Hint panels use a modal-like overlay approach per .hint-system-spec.md

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} css-modal-overlay.test.js\n');

var stylesSrc = fs.readFileSync(path.join(__dirname, '../../shared/styles.css'), 'utf-8');

console.log('\u2500\u2500 Modal overlay checks \u2500\u2500\n');

// 1. Fixed/absolute positioning for overlay
var hasFixedPos = stylesSrc.includes('position: fixed') || stylesSrc.includes('position:fixed');
test('position:fixed defined (overlay/modal)', hasFixedPos);

// 2. z-index > 100 for overlay (above regular content)
var hasHighZIndex = stylesSrc.includes('z-index: 9999') || stylesSrc.includes('z-index:9999') ||
                    stylesSrc.includes('z-index: 1000') || stylesSrc.includes('z-index:1000') ||
                    stylesSrc.includes('z-index: 200') || stylesSrc.includes('z-index:200');
test('High z-index (>=200) for modal/overlay elements', hasHighZIndex);

// 3. Overlay/modal class defined
var hasOverlayClass = stylesSrc.includes('.modal') || stylesSrc.includes('.overlay') ||
                      stylesSrc.includes('.hint-panel') || stylesSrc.includes('.toast') ||
                      stylesSrc.includes('timer-toast') || stylesSrc.includes('bg-overlay');
test('Modal/overlay/hint-panel class defined', hasOverlayClass);

console.log('\n' + '='.repeat(50));
console.log('css-modal-overlay: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
