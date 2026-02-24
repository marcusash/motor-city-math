// index-viewport-meta test
// index.html and exam.html must have viewport meta tag
// Without it, mobile zoom breaks all layout for Kai

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} index-viewport-meta.test.js\n');

var files = {
    'index.html': fs.readFileSync(path.join(__dirname, '../../index.html'), 'utf-8'),
    'exam.html':  fs.readFileSync(path.join(__dirname, '../../exam.html'), 'utf-8'),
};

console.log('\u2500\u2500 viewport meta tag checks \u2500\u2500\n');

Object.keys(files).forEach(function(fname) {
    var src = files[fname];
    var hasViewport = src.includes('name="viewport"') || src.includes("name='viewport'");
    test(fname + ': has viewport meta tag', hasViewport);

    var hasWidth = src.includes('width=device-width');
    test(fname + ': viewport includes width=device-width', hasWidth);
});

console.log('\n' + '='.repeat(50));
console.log('index-viewport-meta: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
