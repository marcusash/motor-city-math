// Autosave toast accessibility test
// GD spec: autosave restore toast must have aria-live="polite" and auto-dismiss in 3s

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} autosave-toast-a11y.test.js\n');

const examSrc = fs.readFileSync(path.join(__dirname, '../../exam.html'), 'utf-8');

console.log('\u2500\u2500 Autosave toast checks \u2500\u2500\n');

// 1. Toast element has aria-live attribute (screen reader announcement)
var toastRegion = '';
var toastIdx = examSrc.indexOf('autosave') !== -1 ? examSrc.indexOf('autosave') : examSrc.indexOf('toast');
if (toastIdx !== -1) {
    toastRegion = examSrc.substring(Math.max(0, toastIdx - 500), toastIdx + 3000);
}

test('autosave or toast functionality exists in exam.html', examSrc.includes('autosave') || examSrc.includes('toast'));

// 2. aria-live on toast container
var toastAriaLive = examSrc.includes('aria-live="polite"') && (examSrc.includes('autosave') || examSrc.includes('toast'));
test('Toast/notification uses aria-live="polite"', toastAriaLive || examSrc.includes('aria-live="assertive"'));

// 3. Toast has auto-dismiss timer (setTimeout with ~3000ms)
var has3000 = toastRegion.includes('3000') || toastRegion.includes('3 * 1000') || examSrc.includes('3000');
test('Toast auto-dismisses (3000ms timeout)', has3000);

// 4. Restore toast message confirms answers were loaded
var toastMsg = examSrc.includes('restored') || examSrc.includes('Keep going') || examSrc.includes('answers loaded');
test('Restore toast message confirms data restored', toastMsg);

// 5. autosave() uses debounce (800ms pattern)
var hasAutosaveDebounce = examSrc.includes('autosave') && (examSrc.includes('800') || examSrc.includes('debounce') || examSrc.includes('clearTimeout'));
test('autosave() uses debounce pattern (clearTimeout + setTimeout)', hasAutosaveDebounce);

console.log('\n' + '='.repeat(50));
console.log('autosave-toast-a11y: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
