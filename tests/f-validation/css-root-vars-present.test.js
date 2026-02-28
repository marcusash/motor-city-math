// css-root-vars-present test
// :root must define CSS custom properties (design token system)
// Already checks count -- this checks specific required tokens exist

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} css-root-vars-present.test.js\n');

var cssSrc = fs.readFileSync(path.join(__dirname, '../../shared/styles.css'), 'utf-8');

// Required tokens per design system spec
var REQUIRED = ['--accent-red', '--accent-blue', '--font-body', '--text-primary', '--bg-page'];

console.log('\u2500\u2500 Required CSS token checks \u2500\u2500\n');

REQUIRED.forEach(function(token) {
    var found = cssSrc.includes(token);
    if (!found) console.log('  ! Missing token: ' + token);
    test('CSS token ' + token + ' defined', found);
});

console.log('\n' + '='.repeat(50));
console.log('css-root-vars-present: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
