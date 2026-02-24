// index-has-skip-link test
// index.html should have a skip navigation link for keyboard/screen reader users
// Required for WCAG 2.4.1 (Bypass Blocks)

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} index-has-skip-link.test.js\n');

var html = fs.readFileSync(path.join(__dirname, '../../index.html'), 'utf-8');

// Skip link pattern: href="#main" or href="#content" near the top of the body
var hasSkipLink = /href\s*=\s*["']#(main|content|maincontent|skip-to)["']/i.test(html) ||
                  /skip[- ]?(to[- ])?main|skip[- ]?nav/i.test(html);

test('index.html has a skip navigation link (WCAG 2.4.1)', hasSkipLink);

console.log('\n' + '='.repeat(50));
console.log('index-has-skip-link: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
