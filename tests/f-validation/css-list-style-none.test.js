// css-list-style-none test
// CSS should remove list bullets from navigation elements
// Browser-default bullets on nav lists look unprofessional

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} css-list-style-none.test.js\n');

var css = fs.readFileSync(path.join(__dirname, '../../shared/styles.css'), 'utf-8');

var hasListStyleNone = /list-style\s*:\s*none/.test(css);

test('CSS removes list bullets with list-style: none', hasListStyleNone);

console.log('\n' + '='.repeat(50));
console.log('css-list-style-none: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
