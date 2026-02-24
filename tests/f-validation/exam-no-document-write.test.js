// exam-no-document-write test
// exam.html must not use document.write() which blocks parsing and is XSS-risky

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} exam-no-document-write.test.js\n');

var html = fs.readFileSync(path.join(__dirname, '../../exam.html'), 'utf-8');

console.log('\u2500\u2500 document.write() absence checks \u2500\u2500\n');

var hasDocWrite = html.includes('document.write(');
test('exam.html does not use document.write()', !hasDocWrite);

var files = ['index.html', 'shared/scripts.js'];
files.forEach(function(fname) {
    var fp = path.join(__dirname, '../../' + fname);
    if (!fs.existsSync(fp)) return;
    var c = fs.readFileSync(fp, 'utf-8');
    test(fname + ' does not use document.write()', !c.includes('document.write('));
});

console.log('\n' + '='.repeat(50));
console.log('exam-no-document-write: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
