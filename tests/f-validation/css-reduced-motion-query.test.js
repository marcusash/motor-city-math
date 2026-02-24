// css-reduced-motion-query test
// shared/styles.css must have a prefers-reduced-motion media query
// Animations cause distress for some users; reduced motion is WCAG 2.3.3

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} css-reduced-motion-query.test.js\n');

var css = fs.readFileSync(path.join(__dirname, '../../shared/styles.css'), 'utf-8');

var hasReducedMotion = /prefers-reduced-motion/.test(css);
var reducedMotionCount = (css.match(/prefers-reduced-motion/g) || []).length;

test('CSS defines @media (prefers-reduced-motion)', hasReducedMotion);
console.log('  prefers-reduced-motion occurrences: ' + reducedMotionCount);

console.log('\n' + '='.repeat(50));
console.log('css-reduced-motion-query: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
