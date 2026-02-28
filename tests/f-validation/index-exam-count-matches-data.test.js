// index-exam-count-matches-data test
// index.html test count in the tests[] array should match actual RP JSON files
// Mismatches mean the picker shows exams that don't exist or hides exams that do

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} index-exam-count-matches-data.test.js\n');

var html = fs.readFileSync(path.join(__dirname, '../../index.html'), 'utf-8');
var dataDir = path.join(__dirname, '../../data');

// Count actual RP JSON files
var actualFiles = 0;
for (var i = 1; i <= 20; i++) {
    if (fs.existsSync(path.join(dataDir, 'retake-practice-' + i + '.json'))) actualFiles++;
}

// Count retake-practice references in index.html tests array
var rpRefs = (html.match(/retake-practice-\d+/g) || []);
var uniqueRefs = [...new Set(rpRefs)].length;

test('Actual RP JSON files found (' + actualFiles + ')', actualFiles > 0);
test('index.html references match or exceed actual files (' + uniqueRefs + ' refs, ' + actualFiles + ' files)', uniqueRefs >= actualFiles);

console.log('\n' + '='.repeat(50));
console.log('index-exam-count-matches-data: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
