// shared-scripts-save-results test
// shared/scripts.js must export saveResults() function
// saveResults is called by exam.html after submission -- missing = no score history

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} shared-scripts-save-results.test.js\n');

var scriptsSrc = fs.readFileSync(path.join(__dirname, '../../shared/scripts.js'), 'utf-8');

console.log('\u2500\u2500 saveResults API checks \u2500\u2500\n');

// 1. saveResults function defined
var hasSaveResults = scriptsSrc.includes('saveResults') && 
                     (scriptsSrc.includes('function saveResults') || scriptsSrc.includes('saveResults ='));
test('saveResults() function defined in shared/scripts.js', hasSaveResults);

// 2. Uses localStorage for persistence
var hasLocalStorage = scriptsSrc.includes('localStorage') && scriptsSrc.includes('setItem');
test('saveResults uses localStorage.setItem', hasLocalStorage);

// 3. Saves score data (score, date, examId)
var savesScore = scriptsSrc.includes('score') && scriptsSrc.includes('JSON.stringify');
test('saveResults serializes score data with JSON.stringify', savesScore);

console.log('\n' + '='.repeat(50));
console.log('shared-scripts-save-results: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
