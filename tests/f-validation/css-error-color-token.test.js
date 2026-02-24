// css-error-color-token test
// CSS should define an error/wrong color token for incorrect answer feedback
// Without it, wrong answer colors get hardcoded and inconsistently applied

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} css-error-color-token.test.js\n');

var css = fs.readFileSync(path.join(__dirname, '../../shared/styles.css'), 'utf-8');

var hasError = /--error|--wrong|--accent-red|--color-error|--danger/.test(css);

test('CSS defines an error/wrong color token', hasError);

console.log('\n' + '='.repeat(50));
console.log('css-error-color-token: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
