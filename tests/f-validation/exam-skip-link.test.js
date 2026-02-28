// exam-skip-link test
// exam.html should have a skip-to-content link for keyboard users (WCAG 2.4.1)

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} exam-skip-link.test.js\n');

var f = path.join(__dirname, '../../exam.html');
var html = fs.readFileSync(f, 'utf-8');

console.log('\u2500\u2500 Skip link checks for exam.html \u2500\u2500\n');

var hasSkipLink = /skip[^"]*content|skip[^"]*main|skip.*nav/i.test(html) ||
                  html.includes('#main') || html.includes('skip-link') || html.includes('skipLink');

test('exam.html has skip-to-main-content link', hasSkipLink);

// Also check for lang attribute (accessibility requirement)
test('exam.html has lang attribute on <html>', /<html[^>]+lang\s*=/i.test(html));

console.log('\n' + '='.repeat(50));
console.log('exam-skip-link: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
