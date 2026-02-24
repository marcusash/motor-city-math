// index-no-dead-exam-references test
// All exam files referenced in index.html tests[] must exist in /data/
// Dead references let Kai pick an exam that returns 404

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} index-no-dead-exam-references.test.js\n');

var indexSrc = fs.readFileSync(path.join(__dirname, '../../index.html'), 'utf-8');
var dataDir = path.join(__dirname, '../../data');

// Extract all retake-practice-N references
var refs = indexSrc.match(/retake-practice-\d+/g) || [];
var unique = [...new Set(refs)];

console.log('\u2500\u2500 Exam file existence checks \u2500\u2500\n');

var broken = [];
unique.forEach(function(ref) {
    var fp = path.join(dataDir, ref + '.json');
    var exists = fs.existsSync(fp);
    console.log('  ' + (exists ? '\u2705' : '\u274c') + ' data/' + ref + '.json');
    if (!exists) broken.push(ref);
});

test('All ' + unique.length + ' exam files referenced in index.html exist on disk', broken.length === 0);

console.log('\n' + '='.repeat(50));
console.log('index-no-dead-exam-references: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
