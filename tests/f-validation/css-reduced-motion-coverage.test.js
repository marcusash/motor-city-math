// CSS prefers-reduced-motion coverage test
// WCAG 2.3.3: all animated elements must have reduced-motion alternatives
// MCM: all animations must be suppressed when prefers-reduced-motion: reduce

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} css-reduced-motion-coverage.test.js\n');

var cssSrc = fs.readFileSync(path.join(__dirname, '../../shared/styles.css'), 'utf-8');

console.log('\u2500\u2500 CSS prefers-reduced-motion coverage \u2500\u2500\n');

// 1. @media prefers-reduced-motion block exists
var hasReducedMotion = cssSrc.includes('prefers-reduced-motion');
test('@media (prefers-reduced-motion) block exists in shared/styles.css', hasReducedMotion);

// 2. transition suppressed in reduced-motion block
var reducedMotionMatch = cssSrc.match(/@media[^{]*prefers-reduced-motion[^{]*reduce[^{]*\{([\s\S]*?)(?=@media|\s*$)/m);
var reducedBlock = reducedMotionMatch ? reducedMotionMatch[1] : '';
// Also search more broadly
if (!reducedBlock || reducedBlock.length < 5) {
    var idx = cssSrc.indexOf('prefers-reduced-motion');
    if (idx >= 0) {
        var blockStart = cssSrc.indexOf('{', idx);
        reducedBlock = blockStart >= 0 ? cssSrc.slice(blockStart, blockStart + 500) : '';
    }
}
var hasTransitionNone = cssSrc.includes('prefers-reduced-motion') && 
                        (reducedBlock.includes('transition') || cssSrc.includes('transition: none'));
test('transition suppressed or handled in prefers-reduced-motion context', hasTransitionNone);

// 3. animation suppressed in reduced-motion block
var hasAnimationNone = reducedBlock.includes('animation') && (reducedBlock.includes('none') || reducedBlock.includes('0s'));
test('animation: none in prefers-reduced-motion block', hasAnimationNone);

// 4. keyframe animations used in codebase
var keyframeCount = (cssSrc.match(/@keyframes/g) || []).length;
test('At least 1 @keyframes animation exists (ensuring coverage is meaningful)', keyframeCount >= 1);

// 5. At least one named animation exists (timer-pulse, toastIn, restoreSlideIn etc.)
var hasNamedAnimation = cssSrc.includes('@keyframes timer') || cssSrc.includes('@keyframes toast') ||
                        cssSrc.includes('@keyframes restore') || cssSrc.includes('animation:');
test('Named animations exist (timer-pulse, toastIn, or similar)', hasNamedAnimation);

console.log('\n' + '='.repeat(50));
console.log('css-reduced-motion-coverage: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
