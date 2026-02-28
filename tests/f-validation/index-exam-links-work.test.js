// index-exam-links-work test
// All exam links in index.html must point to exam.html with valid ?file= param
// Broken exam links mean Kai gets a 404 instead of a test

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} index-exam-links-work.test.js\n');

var indexSrc = fs.readFileSync(path.join(__dirname, '../../index.html'), 'utf-8');
var dataDir = path.join(__dirname, '../../data');

console.log('\u2500\u2500 Exam link checks \u2500\u2500\n');

// Extract file= params from exam links
var fileParams = [];
var re = /exam\.html[^"']*\?[^"']*file=([^"'&\s]+)/g;
var m;
while ((m = re.exec(indexSrc)) !== null) {
    fileParams.push(m[1]);
}

// Remove duplicates
var unique = fileParams.filter(function(v, i) { return fileParams.indexOf(v) === i; });
var missing = [];
unique.forEach(function(param) {
    // Check if the referenced data file exists
    var jsonFile = path.join(dataDir, param + '.json');
    if (!fs.existsSync(jsonFile)) {
        missing.push('exam link ?file=' + param + ' has no matching data/' + param + '.json');
    }
});
if (missing.length) missing.forEach(function(v) { console.log('  ! ' + v); });

test('All ' + unique.length + ' exam file params have matching JSON files', missing.length === 0);

console.log('\n' + '='.repeat(50));
console.log('index-exam-links-work: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
