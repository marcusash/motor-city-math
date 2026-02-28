// index-tests-array-count test
// index.html tests[] array should have exactly 11 entries (RP1-11)
// Missing entries means Kai can't see all available exams

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} index-tests-array-count.test.js\n');

var html = fs.readFileSync(path.join(__dirname, '../../index.html'), 'utf-8');

// Find by counting exam.html?file=retake-practice- references
var rpRefs = (html.match(/exam\.html\?file=retake-practice-\d+/g) || []);
// Unique file references
var rpUnique = {};
rpRefs.forEach(function(r) { rpUnique[r] = 1; });
var rpRefCount = Object.keys(rpUnique).length;

// Also look for the tests array by JS object entries with file: property
var testsMatch = html.match(/\{\s*file\s*:/g) || [];
var entryCount = testsMatch.length;

test('index.html has tests array defined', entryCount > 0 || rpRefCount > 0);
test('index.html references at least 11 retake-practice files', rpRefCount >= 11 || entryCount >= 11);
console.log('  unique retake-practice links: ' + rpRefCount + ', test object entries: ' + entryCount);

console.log('\n' + '='.repeat(50));
console.log('index-tests-array-count: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
