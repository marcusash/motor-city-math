// shared-styles-animation-safe test
// animations in styles.css must respect prefers-reduced-motion
// Users with vestibular disorders may be harmed by motion

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} shared-styles-animation-safe.test.js\n');

var cssSrc = fs.readFileSync(path.join(__dirname, '../../shared/styles.css'), 'utf-8');

console.log('\u2500\u2500 Animation safety checks \u2500\u2500\n');

// animations/transitions defined
var hasAnimations = cssSrc.includes('animation') || cssSrc.includes('@keyframes') ||
                    cssSrc.includes('transition');
test('Animation/transition styles defined in styles.css', hasAnimations);

// prefers-reduced-motion media query present
var hasReducedMotion = cssSrc.includes('prefers-reduced-motion');
test('prefers-reduced-motion media query present', hasReducedMotion);

// Inside prefers-reduced-motion: animation disabled
var reducedMotionBlock = cssSrc.match(/prefers-reduced-motion[\s\S]*?\}[\s\S]*?\}/);
var hasAnimationNone = reducedMotionBlock && 
                       (reducedMotionBlock[0].includes('animation: none') || 
                        reducedMotionBlock[0].includes('transition: none') ||
                        reducedMotionBlock[0].includes('animation:none'));
test('prefers-reduced-motion block disables animations', !!hasAnimationNone);

console.log('\n' + '='.repeat(50));
console.log('shared-styles-animation-safe: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
