// localStorage key uniqueness across all HTML files
// EACH HTML file should use a UNIQUE localStorage key for results
// Shared key = data from one test overwrites another (known bug fixed in prior sprint)
// Ref: tests/f-validation/localstorage-schema-guard.test.js

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} localstorage-key-uniqueness.test.js\n');

var root = path.join(__dirname, '../../');
var htmlFiles = ['exam.html', 'index.html', 'final_exam_251123.html', 'final_exam_251123_mini.html'];

console.log('\u2500\u2500 localStorage key uniqueness \u2500\u2500\n');

var keyMap = {};
htmlFiles.forEach(function(f) {
    var fpath = path.join(root, f);
    if (!fs.existsSync(fpath)) return;
    var src = fs.readFileSync(fpath, 'utf-8');
    // Extract localStorage.getItem/setItem key strings
    var re = /localStorage\.(?:getItem|setItem)\(['"]([^'"]+)['"]/g;
    var m;
    var keys = new Set();
    while ((m = re.exec(src)) !== null) {
        keys.add(m[1]);
    }
    if (keys.size > 0) {
        keyMap[f] = Array.from(keys);
        console.log('  ' + f + ': ' + Array.from(keys).join(', '));
    }
});

// Check that exam.html uses a dynamic key (per-exam), not a hardcoded shared one
var examSrc = fs.readFileSync(path.join(root, 'exam.html'), 'utf-8');
// exam.html should use a key that includes the exam file name (dynamic per exam)
var hasDynamicKey = examSrc.includes('currentFile') || examSrc.includes('fileName') ||
                    examSrc.includes('examFile') || examSrc.includes('storageKey') ||
                    examSrc.includes('file +') || examSrc.includes('+ file') ||
                    examSrc.includes('fileParam') || examSrc.includes('mcm_');
test('exam.html uses per-exam dynamic localStorage key (not shared key)', hasDynamicKey);

// Check that index.html reads scores from multiple keys (aggregation)
var indexSrc = fs.readFileSync(path.join(root, 'index.html'), 'utf-8');
var hasMultiKeyRead = indexSrc.includes('getScores') || indexSrc.includes('getItem') &&
                      (indexSrc.includes('retake-practice') || indexSrc.includes('mcm_'));
test('index.html reads scores across multiple per-exam keys', hasMultiKeyRead);

// Warn if 'algebra2TestResults' shared key still used in multiple files
var sharedKey = 'algebra2TestResults';
var sharedKeyUsers = htmlFiles.filter(function(f) {
    var fpath = path.join(root, f);
    return fs.existsSync(fpath) && fs.readFileSync(fpath, 'utf-8').includes(sharedKey);
});
test('Shared key "algebra2TestResults" used in <=1 file (if multiple: data collision risk)', sharedKeyUsers.length <= 1);
if (sharedKeyUsers.length > 1) {
    console.log('  ! "' + sharedKey + '" used in: ' + sharedKeyUsers.join(', '));
}

console.log('\n' + '='.repeat(50));
console.log('localstorage-key-uniqueness: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
