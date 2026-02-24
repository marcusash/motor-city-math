// exam-local-storage-key-unique test
// exam.html must use a unique localStorage key per exam file
// Shared keys between exams overwrite each other's saved answers

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} exam-local-storage-key-unique.test.js\n');

var examSrc = fs.readFileSync(path.join(__dirname, '../../exam.html'), 'utf-8');

console.log('\u2500\u2500 localStorage key uniqueness checks \u2500\u2500\n');

// 1. localStorage used for saving
var hasLocalStorage = examSrc.includes('localStorage');
test('localStorage used in exam.html', hasLocalStorage);

// 2. Key uses dynamic value (file name from URL param)
var hasDynamicKey = examSrc.includes('examFile') || examSrc.includes('file=') || 
                    examSrc.includes('URLSearchParams') || examSrc.includes('searchParams');
test('localStorage key is dynamic (based on exam filename)', hasDynamicKey);

// 3. No hardcoded key like 'answers' that would conflict
var hardcodedKey = examSrc.match(/localStorage\.(setItem|getItem)\s*\(\s*['"]answers['"]\s*,/);
test('No hardcoded localStorage key "answers" (would conflict between exams)', !hardcodedKey);

console.log('\n' + '='.repeat(50));
console.log('exam-local-storage-key-unique: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
