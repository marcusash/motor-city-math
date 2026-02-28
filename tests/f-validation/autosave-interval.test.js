// Autosave interval test -- GD sw-07
// exam.html must autosave Kai's answers every 30s or on input change
// Ensures Kai doesn't lose work if browser closes or page refreshes

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} autosave-interval.test.js\n');

var examSrc = fs.readFileSync(path.join(__dirname, '../../exam.html'), 'utf-8');

var sharedSrc = fs.readFileSync(path.join(__dirname, '../../shared/scripts.js'), 'utf-8');

// 1. setInterval or input listeners for autosave
var hasInterval = examSrc.includes('setInterval') ||
                  (sharedSrc.includes('setInterval') && sharedSrc.includes('save'));
var hasInputSave = examSrc.includes('addEventListener') && examSrc.includes('localStorage');
test('Periodic (setInterval) or on-change autosave mechanism exists', hasInterval || hasInputSave);

// 2. Autosave writes to localStorage
var hasAutoSave = (examSrc.includes('autosave') || examSrc.includes('autoSave')) &&
                  examSrc.includes('localStorage');
test('Autosave writes to localStorage', hasAutoSave);

// 3. Toast notification on autosave (GD spec: show feedback when saved)
var hasToast = examSrc.includes('toast') || examSrc.includes('Toast') || examSrc.includes('Saved');
test('Autosave shows toast or notification', hasToast);

// 4. Input event listeners for on-change autosave
var hasInputListener = examSrc.includes('addEventListener') && (examSrc.includes("'input'") || examSrc.includes('"input"') || examSrc.includes("'change'"));
test('Input event listeners for on-change autosave', hasInputListener);

// 5. Saved data includes question answers (not just metadata)
var hasSavedAnswers = (examSrc.includes('savedAnswers') || examSrc.includes('saved_answers') ||
                       examSrc.includes('answers')) && examSrc.includes('localStorage.setItem');
test('Saved data includes question answers', hasSavedAnswers);

console.log('\n' + '='.repeat(50));
console.log('autosave-interval: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
