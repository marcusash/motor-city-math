// shared/scripts.js global scope test
// Verifies key functions are at root scope (no module.exports, no wrapping IIFE)
// Motor City Math is a pure browser script — no module system

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} shared-scripts-global-scope.test.js\n');

const src = fs.readFileSync(path.join(__dirname, '../../shared/scripts.js'), 'utf-8');

console.log('\u2500\u2500 Global scope checks \u2500\u2500\n');

// 1. No module.exports (CommonJS)
test('No module.exports (not CJS module)', !src.includes('module.exports'));

// 2. No export default / export { } (ES module)
test('No ES module export syntax', !src.match(/^export\s+(default\s+|const\s+|function\s+|\{)/m));

// 3. Key functions defined at root level (not inside another function)
var keyFunctions = ['parseStudentAnswer', 'showAnswerKey', 'initTimer', 'gradeTest', 'checkAnswer', 'saveResults'];
// formatTime is intentionally nested inside initTimer (private helper) -- excluded
keyFunctions.forEach(function(fn) {
    var re = new RegExp('^function ' + fn + '\\s*\\(', 'm');
    test('function ' + fn + '() at root scope', re.test(src));
});

// 4. No wrapping IIFE that hides all globals (file-level IIFE)
// Inline IIFEs like (function(){...})() used for event listener setup are OK
// A file-level IIFE would need to be the FIRST non-whitespace/comment line
var nonCommentLines = src.split('\n').filter(function(l) { return l.trim() && !l.trim().startsWith('//') && !l.trim().startsWith('*'); });
var firstCodeLine = nonCommentLines[0] || '';
var iife = firstCodeLine.match(/^\(function\s*\(\)/);
test('No file-level wrapping IIFE hiding globals', !iife);

// 5. No "use strict" at file level (would restrict implicit globals in some engines)
// NOTE: "use strict" inside individual functions is OK
var fileStrictMatch = src.match(/^['"]use strict['"];/m);
test('No file-level "use strict" (browser compat)', !fileStrictMatch);

console.log('\n' + '='.repeat(50));
console.log('shared-scripts-global-scope: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
