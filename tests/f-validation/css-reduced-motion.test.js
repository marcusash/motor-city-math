// css-reduced-motion test
// shared/styles.css must respect prefers-reduced-motion
// Kai may have motion sensitivity -- all animations must have a reduced-motion fallback

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} css-reduced-motion.test.js\n');

var stylesSrc = fs.readFileSync(path.join(__dirname, '../../shared/styles.css'), 'utf-8');

console.log('\u2500\u2500 Reduced motion checks \u2500\u2500\n');

// 1. prefers-reduced-motion media query exists
var hasReducedMotion = stylesSrc.includes('prefers-reduced-motion');
test('@media (prefers-reduced-motion) defined in shared/styles.css', hasReducedMotion);

// 2. animation: none inside the block (disabling animations for users who need it)
var reducedMotionBlock = '';
if (hasReducedMotion) {
    var idx = stylesSrc.indexOf('prefers-reduced-motion');
    reducedMotionBlock = stylesSrc.substring(idx, idx + 500);
}
var disablesAnimation = reducedMotionBlock.includes('animation') && 
                        (reducedMotionBlock.includes('none') || reducedMotionBlock.includes('0'));
test('Animations disabled/reduced inside prefers-reduced-motion block', disablesAnimation);

console.log('\n' + '='.repeat(50));
console.log('css-reduced-motion: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
