// shared-scripts-save-results-api test
// shared/scripts.js must expose a saveResults() function
// This is the core save API used by all exam pages

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} shared-scripts-save-results-api.test.js\n');

var scripts = fs.readFileSync(path.join(__dirname, '../../shared/scripts.js'), 'utf-8');

var hasSaveResults = /function\s+saveResults/.test(scripts);
var hasLocalStorageKey = /localStorage\.setItem/.test(scripts);
var hasParams = /saveResults\s*\(/.test(scripts);

test('shared/scripts.js defines saveResults()', hasSaveResults);
test('shared/scripts.js writes to localStorage', hasLocalStorageKey);
test('saveResults is callable (has function + call)', hasSaveResults && hasParams);

console.log('\n' + '='.repeat(50));
console.log('shared-scripts-save-results-api: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
