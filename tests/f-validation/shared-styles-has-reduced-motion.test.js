// shared-styles-has-reduced-motion test
// shared/styles.css must include @media (prefers-reduced-motion: reduce) rule
// This is a WCAG 2.3.3 requirement and ADHD accessibility requirement

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} shared-styles-has-reduced-motion.test.js\n');

var stylesSrc = fs.readFileSync(path.join(__dirname, '../../shared/styles.css'), 'utf-8');
var examSrc = fs.readFileSync(path.join(__dirname, '../../exam.html'), 'utf-8');
var indexSrc = fs.readFileSync(path.join(__dirname, '../../index.html'), 'utf-8');

console.log('\u2500\u2500 Reduced motion checks \u2500\u2500\n');

// 1. prefers-reduced-motion in shared styles
var stylesHasReducedMotion = stylesSrc.includes('prefers-reduced-motion');
test('shared/styles.css has prefers-reduced-motion rule', stylesHasReducedMotion);

// 2. Animations disabled in reduced motion
var disablesAnimations = stylesSrc.includes('animation: none') || stylesSrc.includes('animation:none') ||
                         stylesSrc.includes('transition: none') || stylesSrc.includes('transition:none');
test('Animations/transitions disabled in reduced motion mode', disablesAnimations);

// 3. At least one of the HTML files also has reduced motion check
var htmlHasReducedMotion = examSrc.includes('prefers-reduced-motion') || indexSrc.includes('prefers-reduced-motion');
test('At least one HTML file also handles prefers-reduced-motion', htmlHasReducedMotion);

console.log('\n' + '='.repeat(50));
console.log('shared-styles-has-reduced-motion: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
