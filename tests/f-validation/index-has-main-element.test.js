// index-has-main-element test
// index.html must have a semantic <main> element
// Screen readers use <main> for "jump to main content" navigation

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} index-has-main-element.test.js\n');

var html = fs.readFileSync(path.join(__dirname, '../../index.html'), 'utf-8');

var hasMain = /<main[\s>]/i.test(html);
var hasRoleMain = /role\s*=\s*["']main["']/i.test(html);

test('index.html has a <main> or role="main" element', hasMain || hasRoleMain);
if (!hasMain && !hasRoleMain) console.log('    ! No <main> element found. Add for screen reader landmark nav.');

console.log('\n' + '='.repeat(50));
console.log('index-has-main-element: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
