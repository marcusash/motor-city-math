// index-exam-file-size test
// index.html must be under 200KB
// Large dashboard file hurts load time on mobile network

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} index-exam-file-size.test.js\n');

var files = [
    { name: 'index.html', max: 200 * 1024 },
    { name: 'exam.html', max: 250 * 1024 },
    { name: 'shared/styles.css', max: 100 * 1024 },
    { name: 'shared/scripts.js', max: 50 * 1024 }
];

console.log('\u2500\u2500 File size checks \u2500\u2500\n');

var overLimit = [];
files.forEach(function(f) {
    var fp = path.join(__dirname, '../../' + f.name);
    if (!fs.existsSync(fp)) {
        console.log('  ' + f.name + ': NOT FOUND');
        overLimit.push(f.name + ': missing');
        return;
    }
    var bytes = fs.statSync(fp).size;
    var kb = (bytes / 1024).toFixed(1);
    var maxKb = (f.max / 1024).toFixed(0);
    var ok = bytes <= f.max;
    console.log('  ' + (ok ? '\u2705' : '\u274c') + ' ' + f.name + ': ' + kb + 'KB (limit ' + maxKb + 'KB)');
    if (!ok) overLimit.push(f.name + ': ' + kb + 'KB');
});

test('All core files within size limits', overLimit.length === 0);

console.log('\n' + '='.repeat(50));
console.log('index-exam-file-size: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
