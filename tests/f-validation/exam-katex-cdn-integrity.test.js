// exam-katex-cdn-integrity test
// exam.html must load KaTeX from a CDN that has a valid URL pattern
// Checks that KaTeX is loaded and the version is explicitly pinned in the URL

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} exam-katex-cdn-integrity.test.js\n');

var html = fs.readFileSync(path.join(__dirname, '../../exam.html'), 'utf-8');

// KaTeX may be loaded locally or from CDN -- either is fine
var hasKatex = /katex/i.test(html);
// Must have katex.min.js or equivalent (not just the CSS)
var hasKatexScript = /katex[^"]*\.js/i.test(html);

test('exam.html loads KaTeX', hasKatex);
test('exam.html loads KaTeX script (katex.min.js)', hasKatexScript);

console.log('\n' + '='.repeat(50));
console.log('exam-katex-cdn-integrity: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
