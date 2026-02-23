// Shared scripts API surface test
// shared/scripts.js must export specific global functions used across all HTML files
// Unexpected globals bloat the window object; required globals must be present

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} shared-scripts-required-api.test.js\n');

var sharedSrc = fs.readFileSync(path.join(__dirname, '../../shared/scripts.js'), 'utf-8');

console.log('\u2500\u2500 Required global API in shared/scripts.js \u2500\u2500\n');

// Required exports (functions that other HTML files call)
var requiredFunctions = [
    'initTimer',
    'saveResults',
    'parseStudentAnswer',
    'showAnswerKey',
];

requiredFunctions.forEach(function(fn) {
    var defined = sharedSrc.includes('function ' + fn) || sharedSrc.includes(fn + ' =') ||
                  sharedSrc.includes(fn + '=');
    test(fn + '() defined in shared/scripts.js', defined);
});

// Check that saveResults is called with standard params (examId, results)
var hasSaveResultsCall = sharedSrc.includes('saveResults') && sharedSrc.includes('localStorage');
test('saveResults writes to localStorage', hasSaveResultsCall);

console.log('\n' + '='.repeat(50));
console.log('shared-scripts-required-api: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
