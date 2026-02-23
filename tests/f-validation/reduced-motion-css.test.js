// Reduced motion CSS test
// WCAG 2.3.3: CSS transitions/animations must be suppressed when prefers-reduced-motion: reduce

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} reduced-motion-css.test.js\n');

const src = fs.readFileSync(path.join(__dirname, '../../shared/styles.css'), 'utf-8');

console.log('\u2500\u2500 @media (prefers-reduced-motion) checks \u2500\u2500\n');

// 1. prefers-reduced-motion media query exists
test('prefers-reduced-motion media query present', src.includes('prefers-reduced-motion'));

// 2. The block reduces animations (transition: none or animation: none)
var reduceBlock = '';
var rmStart = src.lastIndexOf('prefers-reduced-motion'); // use last (most comprehensive) block
if (rmStart !== -1) {
    var blockStart = src.lastIndexOf('@media', rmStart);
    var depth = 0;
    var blockEnd = blockStart;
    for (var i = blockStart; i < src.length; i++) {
        if (src[i] === '{') depth++;
        else if (src[i] === '}') { depth--; if (depth === 0) { blockEnd = i + 1; break; } }
    }
    reduceBlock = src.substring(blockStart, blockEnd);
}

console.log('  Reduced motion block length:', reduceBlock.length, 'chars');
test('Reduced motion block suppresses transitions', reduceBlock.includes('transition') && (reduceBlock.includes('none') || reduceBlock.includes('0')));
test('Reduced motion block suppresses animations', reduceBlock.includes('animation') || reduceBlock.includes('transition: none'));

// 3. At least one animation/transition defined elsewhere (otherwise the test is vacuous)
var hasTransitions = src.match(/transition\s*:/g) || [];
test('styles.css has at least one transition (reduced motion is meaningful)', hasTransitions.length > 1);

// 4. exam.html respects prefers-reduced-motion in JS (for JS-driven animations)
var examSrc = fs.readFileSync(path.join(__dirname, '../../exam.html'), 'utf-8');
var indexSrc = fs.readFileSync(path.join(__dirname, '../../index.html'), 'utf-8');
var jsReducedMotion = examSrc.includes('prefers-reduced-motion') || examSrc.includes('prefersReduced') ||
                      indexSrc.includes('prefers-reduced-motion') || indexSrc.includes('prefersReduced');
test('JS checks prefers-reduced-motion for dynamic animations', jsReducedMotion);

console.log('\n' + '='.repeat(50));
console.log('reduced-motion-css: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
