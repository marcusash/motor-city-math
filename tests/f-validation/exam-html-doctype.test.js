// exam-html-doctype test
// exam.html must start with <!DOCTYPE html>
// Missing doctype triggers quirks mode and breaks layout on IE/Edge

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} exam-html-doctype.test.js\n');

var examSrc = fs.readFileSync(path.join(__dirname, '../../exam.html'), 'utf-8');

console.log('\u2500\u2500 DOCTYPE checks \u2500\u2500\n');

// Must be in first 50 chars
var first50 = examSrc.substring(0, 50).toLowerCase();
var hasDoctype = first50.includes('<!doctype html>') || first50.includes('<!doctype html ');
test('exam.html starts with <!DOCTYPE html>', hasDoctype);

// Also check index.html
var indexSrc = fs.readFileSync(path.join(__dirname, '../../index.html'), 'utf-8');
var idx50 = indexSrc.substring(0, 50).toLowerCase();
var indexHasDoctype = idx50.includes('<!doctype html>') || idx50.includes('<!doctype html ');
test('index.html starts with <!DOCTYPE html>', indexHasDoctype);

console.log('\n' + '='.repeat(50));
console.log('exam-html-doctype: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
