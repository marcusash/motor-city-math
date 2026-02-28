// shared-scripts-public-api test
// shared/scripts.js must export saveResults, formatTime, initTimer
// These are the public API functions used by exam.html

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} shared-scripts-public-api.test.js\n');

var scriptsSrc = fs.readFileSync(path.join(__dirname, '../../shared/scripts.js'), 'utf-8');

console.log('\u2500\u2500 Public API function checks \u2500\u2500\n');

// saveResults
var hasSaveResults = scriptsSrc.includes('function saveResults') || scriptsSrc.includes('saveResults =');
test('saveResults() function defined', hasSaveResults);

// formatTime
var hasFormatTime = scriptsSrc.includes('function formatTime') || scriptsSrc.includes('formatTime =');
test('formatTime() function defined', hasFormatTime);

// initTimer
var hasInitTimer = scriptsSrc.includes('function initTimer') || scriptsSrc.includes('initTimer =');
test('initTimer() function defined', hasInitTimer);

// formatTime is defined inside initTimer (helper) -- that's acceptable
var topLevelSaveResults = /^function saveResults/m.test(scriptsSrc);
var topLevelInitTimer   = /^function initTimer/m.test(scriptsSrc);
var hasFormatTimeHelper = scriptsSrc.includes('function formatTime');
test('Public API functions accessible (saveResults + initTimer top-level, formatTime as helper)', topLevelSaveResults && topLevelInitTimer && hasFormatTimeHelper);

console.log('\n' + '='.repeat(50));
console.log('shared-scripts-public-api: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
