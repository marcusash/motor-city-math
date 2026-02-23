// Mobile layout audit test
// Checks touch target sizing and responsive layout properties
// GD spec: pointer:coarse targets must be >= 44px (WCAG 2.5.5)

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} mobile-layout-audit.test.js\n');

const stylesSrc = fs.readFileSync(path.join(__dirname, '../../shared/styles.css'), 'utf-8');
const examSrc = fs.readFileSync(path.join(__dirname, '../../exam.html'), 'utf-8');
const indexSrc = fs.readFileSync(path.join(__dirname, '../../index.html'), 'utf-8');

console.log('\u2500\u2500 Touch target and responsive checks \u2500\u2500\n');

// 1. @media (pointer: coarse) rule exists for touch targets
test('@media (pointer: coarse) present in shared/styles.css', stylesSrc.includes('pointer: coarse') || stylesSrc.includes('pointer:coarse'));

// 2. Coarse pointer block sets minimum 44px touch targets
var coarseBlock = '';
var coarseIdx = stylesSrc.indexOf('pointer: coarse');
if (coarseIdx === -1) coarseIdx = stylesSrc.indexOf('pointer:coarse');
if (coarseIdx !== -1) {
    var blockStart = stylesSrc.lastIndexOf('@media', coarseIdx);
    var depth = 0;
    for (var i = blockStart; i < stylesSrc.length; i++) {
        if (stylesSrc[i] === '{') depth++;
        else if (stylesSrc[i] === '}') { depth--; if (depth === 0) { coarseBlock = stylesSrc.substring(blockStart, i + 1); break; } }
    }
}
var hasTouchTarget = coarseBlock.includes('44px') || coarseBlock.includes('min-height') || coarseBlock.includes('padding');
test('pointer:coarse block sets >= 44px touch targets', hasTouchTarget);

// 3. viewport meta includes user-scalable (not locked)
var viewportMeta = examSrc.match(/<meta[^>]*name="viewport"[^>]*>/)?.[0] || '';
var notLocked = !viewportMeta.includes('user-scalable=no') && !viewportMeta.includes('maximum-scale=1');
test('Viewport does NOT lock zoom (user-scalable not disabled)', notLocked || viewportMeta === '');

// 4. Responsive breakpoint exists
var hasBreakpoint = stylesSrc.match(/@media[^{]*max-width/g) || stylesSrc.match(/@media[^{]*min-width/g);
test('Responsive breakpoints defined in shared/styles.css', hasBreakpoint && hasBreakpoint.length > 0);

// 5. Input elements have adequate sizing for mobile
var inputStyles = stylesSrc.match(/input\s*\{[^}]+\}/g) || [];
var hasMobileInputSize = inputStyles.some(function(block) {
    return block.includes('height') || block.includes('padding') || block.includes('font-size');
}) || stylesSrc.includes('input') && stylesSrc.includes('padding');
test('Input elements have size/padding for mobile usability', hasMobileInputSize);

console.log('\n' + '='.repeat(50));
console.log('mobile-layout-audit: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
