// exam-has-viewport-meta test
// exam.html must have a viewport meta tag for mobile scaling

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} exam-has-viewport-meta.test.js\n');

var html = fs.readFileSync(path.join(__dirname, '../../exam.html'), 'utf-8');

var hasViewport = /<meta[^>]+name\s*=\s*["']viewport["'][^>]*>/i.test(html) ||
                  /<meta[^>]+content\s*=\s*["'][^"']*width=device-width[^"']*["'][^>]*>/i.test(html);

test('exam.html has viewport meta tag', hasViewport);

console.log('\n' + '='.repeat(50));
console.log('exam-has-viewport-meta: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
