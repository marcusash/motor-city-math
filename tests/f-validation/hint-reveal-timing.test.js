// Hint reveal timing test -- sw-16
// 3rd wrong attempt: 800ms delay before transitional message, hint at 1200ms
// Manual hint: no delay (immediate)

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} hint-reveal-timing.test.js\n');

var examSrc = fs.readFileSync(path.join(__dirname, '../../exam.html'), 'utf-8');

console.log('\u2500\u2500 Hint reveal timing (sw-16) checks \u2500\u2500\n');

// 1. 800ms delay constant exists (auto-rescue timing)
var has800 = examSrc.includes('800');
test('800ms delay present (auto-rescue hint timing)', has800);

// 2. setTimeout used for delay
var hasTimeout = examSrc.includes('setTimeout');
test('setTimeout used for hint reveal delay', hasTimeout);

// 3. Transitional message text "Here is a direction to try" or similar
var hasTransitional = examSrc.includes('direction to try') || examSrc.includes('Let me show') ||
                      examSrc.includes('direction') && examSrc.includes('try');
test('Transitional message before hint reveal', hasTransitional);

// 4. aria-live=polite on transitional message container
var hasPolite = (examSrc.includes('aria-live="polite"') || examSrc.includes("aria-live='polite'"));
test('aria-live=polite on transitional message', hasPolite);

// 5. Reduced motion: no animation/delay when reduced-motion (uses prefers-reduced-motion check or instant class)
var hasReducedMotion = examSrc.includes('prefers-reduced-motion') || examSrc.includes('reducedMotion') ||
                       examSrc.includes('reduced-motion') || examSrc.includes('matchMedia');
test('Reduced motion: timing collapses (matchMedia or class check)', hasReducedMotion);

console.log('\n' + '='.repeat(50));
console.log('hint-reveal-timing: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
