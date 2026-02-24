// exam-no-hardcoded-file-paths test
// exam.html must not hardcode specific exam file paths
// File to load should come from URL parameters, not hardcoded strings

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} exam-no-hardcoded-file-paths.test.js\n');

var html = fs.readFileSync(path.join(__dirname, '../../exam.html'), 'utf-8');

// Check that URL params are used to load the exam file
var usesURLParams = /URLSearchParams|location\.search|window\.location/.test(html);
// Check there are no hardcoded retake-practice-N paths in fetch calls
var hardcodedFetch = /fetch\s*\(\s*["']data\/retake-practice-\d+/.test(html);

test('exam.html loads file from URL parameters (not hardcoded)', usesURLParams);
test('No hardcoded retake-practice-N path in fetch calls', !hardcodedFetch);

console.log('\n' + '='.repeat(50));
console.log('exam-no-hardcoded-file-paths: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
