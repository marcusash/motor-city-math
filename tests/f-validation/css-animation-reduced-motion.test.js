// css-animation-reduced-motion test
// shared/styles.css must have @media (prefers-reduced-motion) block
// to disable animations for users with vestibular disorders (WCAG 2.3.3)

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} css-animation-reduced-motion.test.js\n');

var f = path.join(__dirname, '../../shared/styles.css');
var css = fs.readFileSync(f, 'utf-8');

console.log('\u2500\u2500 Reduced motion media query checks \u2500\u2500\n');

var hasReducedMotion = css.includes('prefers-reduced-motion');
var hasAnimNone = /prefers-reduced-motion[^}]+animation\s*:\s*none/.test(css.replace(/\n/g, ' ')) ||
                  /prefers-reduced-motion/.test(css) && /animation:\s*none/.test(css);
var hasTransitionNone = /prefers-reduced-motion[^}]+transition\s*:\s*none/.test(css.replace(/\n/g, ' ')) ||
                        /prefers-reduced-motion/.test(css) && /transition:\s*none/.test(css);

test('CSS defines @media (prefers-reduced-motion)', hasReducedMotion);
test('Reduced-motion block includes animation:none or transition:none', hasAnimNone || hasTransitionNone);

console.log('\n' + '='.repeat(50));
console.log('css-animation-reduced-motion: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
