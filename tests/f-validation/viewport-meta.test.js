// Viewport meta tag test
// All HTML files must have <meta name="viewport"...> for responsive/mobile rendering

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} viewport-meta.test.js\n');

const htmlFiles = [
    'exam.html',
    'index.html',
    'final_exam_251123.html',
    'nonlinear_exam_mvp.html',
    'final_exam_251123_mini.html'
];

var root = path.join(__dirname, '../../');

console.log('\u2500\u2500 Viewport meta tag check \u2500\u2500\n');

var missingViewport = [];
htmlFiles.forEach(function(file) {
    var src = fs.readFileSync(path.join(root, file), 'utf-8');
    var hasViewport = src.includes('name="viewport"') || src.includes("name='viewport'");
    var hasWidthDevice = src.includes('width=device-width');
    if (!hasViewport) {
        console.log('  \u274c ' + file + ': missing viewport meta tag');
        missingViewport.push(file);
    } else if (!hasWidthDevice) {
        console.log('  \u26a0 ' + file + ': viewport meta present but missing width=device-width');
        missingViewport.push(file + ' (no device-width)');
    } else {
        console.log('  \u2705 ' + file + ': viewport meta with device-width');
    }
});

console.log('');
test('All HTML files have viewport meta tag', missingViewport.length === 0);
test(htmlFiles.length + ' HTML files checked', true);

console.log('\n' + '='.repeat(50));
console.log('viewport-meta: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
