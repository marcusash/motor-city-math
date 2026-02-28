// index-exam-links-valid test
// All exam links in index.html must point to files that exist in the repository

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} index-exam-links-valid.test.js\n');

var root = path.join(__dirname, '../..');
var html = fs.readFileSync(path.join(root, 'index.html'), 'utf-8');

// Extract all exam.html?file=X references
var fileRefs = [];
var re = /exam\.html\?file=([\w-]+)/g;
var m;
while ((m = re.exec(html)) !== null) {
    fileRefs.push(m[1]);
}
// Deduplicate
var uniqueRefs = fileRefs.filter(function(v, i, a) { return a.indexOf(v) === i; });

var missing = [];
uniqueRefs.forEach(function(ref) {
    var jsonPath = path.join(root, 'data', ref + '.json');
    if (!fs.existsSync(jsonPath)) {
        missing.push(ref + ' -> data/' + ref + '.json (MISSING)');
    }
});

console.log('\u2500\u2500 Exam link validation \u2500\u2500\n');
console.log('  Links found in index.html: ' + uniqueRefs.length);
if (missing.length) missing.forEach(function(v) { console.log('  ! ' + v); });

test('All exam links in index.html resolve to data JSON files (' + missing.length + ' broken)', missing.length === 0);

console.log('\n' + '='.repeat(50));
console.log('index-exam-links-valid: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
