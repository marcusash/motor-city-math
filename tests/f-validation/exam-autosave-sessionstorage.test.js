// Regression: exam.html autosave uses sessionStorage, not localStorage
// Key pattern: 'exam-autosave-' + examId (tab-scoped, cleared on submit)

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} exam-autosave-sessionStorage.test.js\n');

const src = fs.readFileSync(path.join(__dirname, '../../exam.html'), 'utf-8');

// ── sessionStorage used (not localStorage) ────────────────────
console.log('\u2500\u2500 Storage type \u2500\u2500');
test('sessionStorage.setItem used for autosave', src.includes("sessionStorage.setItem('exam-autosave-' + examId"));
test('sessionStorage.getItem used for restore', src.includes("sessionStorage.getItem('exam-autosave-' + examId"));
test('sessionStorage.removeItem used on submit', src.includes("sessionStorage.removeItem('exam-autosave-' + examId"));
test('localStorage NOT used for autosave', !src.match(/localStorage\.[a-zA-Z]+\(\s*['"]exam-autosave-/));

// ── Key pattern: exam-autosave-{examId} ───────────────────────
console.log('\n\u2500\u2500 Key pattern \u2500\u2500');
test('Key uses exam-autosave- prefix', src.includes("'exam-autosave-' + examId"));
test('Key does NOT hardcode exam id', !src.includes("'exam-autosave-retake-practice-1'"));

// ── Save/restore function names ────────────────────────────────
console.log('\n\u2500\u2500 Save/restore functions \u2500\u2500');
test('autosave function exists', src.includes('function autosave(') || src.includes('function saveProgress('));
test('restoreAutosave function exists', src.includes('function restoreAutosave(') || src.includes('restoreAutosave()'));

// ── Clear on submit ────────────────────────────────────────────
console.log('\n\u2500\u2500 Clear on submit \u2500\u2500');
test('removeItem called on submit/complete', src.includes("sessionStorage.removeItem('exam-autosave-' + examId"));

console.log('\n' + '='.repeat(50));
console.log('exam-autosave-sessionStorage: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
