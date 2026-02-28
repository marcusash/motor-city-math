// css-success-color-token test
// CSS should define a success/correct color token for correct answer feedback
// Without it, correct/wrong feedback colors get hardcoded and hard to maintain

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} css-success-color-token.test.js\n');

var css = fs.readFileSync(path.join(__dirname, '../../shared/styles.css'), 'utf-8');

var hasSuccess = /--success|--correct|--green|--color-success|--accent-green|--color-correct/.test(css);

test('CSS defines a success/correct color token', hasSuccess);

console.log('\n' + '='.repeat(50));
console.log('css-success-color-token: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
