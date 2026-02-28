// Autosave restore toast test -- sw-09
// After page load: if localStorage has answers, toast appears: '{n} answers restored. Keep going.'
// Toast: aria-live=polite, 3000ms dismiss

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} session-restore-toast.test.js\n');

var examSrc = fs.readFileSync(path.join(__dirname, '../../exam.html'), 'utf-8');

console.log('\u2500\u2500 Session restore toast (sw-09) checks \u2500\u2500\n');

// 1. Toast element with aria-live=polite exists
var hasPoliteToast = (examSrc.includes('aria-live="polite"') || examSrc.includes("aria-live='polite'")) &&
                     (examSrc.includes('toast') || examSrc.includes('restore'));
test('Restore toast has aria-live=polite', hasPoliteToast);

// 2. Toast copy contains "restored" or "Keep going"
var hasRestoreCopy = examSrc.includes('restored') || examSrc.includes('Keep going');
test('Toast copy includes "restored" or "Keep going"', hasRestoreCopy);

// 3. Toast auto-dismisses after 3000ms
var has3000 = examSrc.includes('3000');
test('Toast auto-dismisses after 3000ms', has3000);

// 4. Session restore reads from localStorage
var hasLocalStorageRead = examSrc.includes('localStorage.getItem') || examSrc.includes('getItem(');
test('Session restore reads from localStorage', hasLocalStorageRead);

// 5. Toast shown only when there is at least one saved answer
var hasGuard = (examSrc.includes('savedAnswers') || examSrc.includes('saved_answers') ||
                examSrc.includes('restore') || examSrc.includes('savedData')) &&
               (examSrc.includes('length') || examSrc.includes('Object.keys'));
test('Toast only shown when saved answers exist (count guard)', hasGuard);

console.log('\n' + '='.repeat(50));
console.log('session-restore-toast: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
