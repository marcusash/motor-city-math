// index-has-charset-meta test
// index.html must declare charset=UTF-8 in meta tag
// Without charset, special math characters may render as garbage

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} index-has-charset-meta.test.js\n');

var html = fs.readFileSync(path.join(__dirname, '../../index.html'), 'utf-8');

var hasCharset = /<meta[^>]+charset\s*=\s*["']?UTF-8/i.test(html);

test('index.html has <meta charset="UTF-8">', hasCharset);

console.log('\n' + '='.repeat(50));
console.log('index-has-charset-meta: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
