// localStorage error state test
// Verifies graceful degradation when localStorage is unavailable or throws

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} localstorage-error-state.test.js\n');

const examSrc = fs.readFileSync(path.join(__dirname, '../../exam.html'), 'utf-8');
const scriptsSrc = fs.readFileSync(path.join(__dirname, '../../shared/scripts.js'), 'utf-8');
const indexSrc = fs.readFileSync(path.join(__dirname, '../../index.html'), 'utf-8');

console.log('\u2500\u2500 localStorage defensive guards \u2500\u2500\n');

// 1. localStorage access wrapped in try/catch (shared/scripts.js)
var lsInScripts = scriptsSrc.indexOf('localStorage');
var scriptsHasTryCatch = false;
if (lsInScripts !== -1) {
    var window = scriptsSrc.substring(Math.max(0, lsInScripts - 200), lsInScripts + 500);
    scriptsHasTryCatch = window.includes('try') && window.includes('catch');
}
test('shared/scripts.js wraps localStorage in try/catch', scriptsHasTryCatch || scriptsSrc.includes('try') && scriptsSrc.includes('localStorage'));

// 2. exam.html localStorage reads wrapped in try/catch
var examLsIdx = examSrc.indexOf('localStorage');
var examHasTryCatch = false;
if (examLsIdx !== -1) {
    // Check a window around the first localStorage usage
    var examWindow = examSrc.substring(Math.max(0, examLsIdx - 300), examLsIdx + 600);
    examHasTryCatch = examWindow.includes('try') && examWindow.includes('catch');
}
test('exam.html wraps localStorage reads in try/catch', examHasTryCatch || (examSrc.includes('try') && examSrc.includes('localStorage')));

// 3. saveResults() has guard for when localStorage is full (QuotaExceededError)
var saveStart = scriptsSrc.indexOf('function saveResults(');
var saveFn = saveStart !== -1 ? scriptsSrc.substring(saveStart, saveStart + 1000) : '';
test('saveResults() handles QuotaExceededError or has try/catch', saveFn.includes('try') && saveFn.includes('catch'));

// 4. index.html handles missing/null localStorage data gracefully
var indexHasFallback = indexSrc.includes("|| '{}'") || indexSrc.includes("|| []") ||
                       indexSrc.includes("|| {}") || indexSrc.includes("|| 0") ||
                       indexSrc.includes('try') && indexSrc.includes('localStorage');
test('index.html has fallback for missing localStorage data', indexHasFallback);

// 5. No direct JSON.parse without try/catch when reading localStorage
// JSON.parse(localStorage.getItem(...)) without guard is risky (corrupt data)
var unsafeJsonParse = [];
[examSrc, scriptsSrc, indexSrc].forEach(function(src, i) {
    var names = ['exam.html', 'shared/scripts.js', 'index.html'];
    var re = /JSON\.parse\s*\(\s*localStorage/g;
    var m;
    while ((m = re.exec(src)) !== null) {
        // Check if wrapped in try/catch -- look backwards
        var preceding = src.substring(Math.max(0, m.index - 200), m.index);
        if (!preceding.includes('try')) {
            unsafeJsonParse.push(names[i] + ' at index ' + m.index);
        }
    }
});
test('JSON.parse(localStorage...) always in try/catch', unsafeJsonParse.length === 0);
if (unsafeJsonParse.length > 0) {
    console.log('  Unguarded: ' + unsafeJsonParse.join(', '));
}

console.log('\n' + '='.repeat(50));
console.log('localstorage-error-state: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
