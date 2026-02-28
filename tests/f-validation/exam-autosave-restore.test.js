// exam-autosave-restore test
// exam.html should have autosave/restore feature for ADHD support
// Kai's answers should persist if he accidentally closes/refreshes the page

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} exam-autosave-restore.test.js\n');

var examSrc = fs.readFileSync(path.join(__dirname, '../../exam.html'), 'utf-8');

console.log('\u2500\u2500 Autosave/restore checks \u2500\u2500\n');

// 1. Autosave logic present (saves answers on input)
var hasAutosave = examSrc.includes('autosave') || examSrc.includes('auto-save') ||
                  examSrc.includes('localStorage.setItem') && examSrc.includes('input') ||
                  examSrc.includes('sessionStorage') || examSrc.includes('saveAnswers') ||
                  examSrc.includes('storeAnswer');
test('Autosave logic present in exam.html', hasAutosave);

// 2. Restore on load
var hasRestore = examSrc.includes('restoreAnswers') || examSrc.includes('restore') && examSrc.includes('localStorage') ||
                 examSrc.includes('getItem') && examSrc.includes('answer') ||
                 examSrc.includes('autosave') && examSrc.includes('restore');
test('Answer restore on page load', hasRestore);

// 3. Toast/notification for restore (ADHD: must tell Kai answers were restored)
var hasRestoreToast = examSrc.includes('restored') || examSrc.includes('restore toast') ||
                      examSrc.includes('Keep going') || examSrc.includes('answers restored');
test('User notified when answers restored', hasRestoreToast);

console.log('\n' + '='.repeat(50));
console.log('exam-autosave-restore: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
