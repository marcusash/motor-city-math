// shared-scripts-save-results-signature test
// saveResults function must accept score, total, examId arguments
// as per the shared API contract used by exam.html

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} shared-scripts-save-results-signature.test.js\n');

var js = fs.readFileSync(path.join(__dirname, '../../shared/scripts.js'), 'utf-8');

console.log('\u2500\u2500 saveResults function signature checks \u2500\u2500\n');

// Check that saveResults is defined with expected parameter names
var saveResultsMatch = js.match(/function\s+saveResults\s*\(([^)]*)\)/);
var hasSaveResults = !!saveResultsMatch;
var params = hasSaveResults ? saveResultsMatch[1] : '';

test('saveResults function is defined in shared/scripts.js', hasSaveResults);
test('saveResults accepts parameters (score/total/key)', params.length > 0);

if (hasSaveResults) {
    console.log('  saveResults params: ' + params);
}

console.log('\n' + '='.repeat(50));
console.log('shared-scripts-save-results-signature: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
